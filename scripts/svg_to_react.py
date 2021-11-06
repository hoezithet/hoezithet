#! /usr/bin/env python

import argparse
from copy import copy
from pathlib import Path
import re
import sys
import textwrap

sys.path.append('/usr/share/inkscape/extensions')

from inkex.elements import load_svg, Group, SvgDocumentElement  # noqa
from inkex import BoundingBox  # noqa


def kebab_to_camel(kebab):
    return ''.join([w.title() if i > 0 else w
                    for i, w in enumerate(kebab.split('-'))])


def drop_id(node):
    node.pop('id')


def drop_ids(node):
    for el in node.xpath('*[@id]'):
        el.pop('id')
    return node


def get_linked_nodes(node):
    if node.href is not None:
        return [node, *[n for n in get_linked_nodes(node.href)]]
    else:
        return [node]


def get_fill_defs(node):
    fill = node.style['fill']
    if fill is None or len(fill) < 3 or fill[:3] != 'url':
        return []
    else:
        linked_node = node.root.getElementById(fill)
        return get_linked_nodes(linked_node)


def style_str_to_react(style_str: str):
    style_dict = {}
    for style in style_str.split(';'):
        k, v = style.split(':')
        if 'inkscape' in k:
            continue
        style_dict[kebab_to_camel(k)] = v
    return ' '.join([
        f'{k}="{v}"'
        for k, v in style_dict.items()
    ])


def style_to_react(file_text: str):
    new_file_text = copy(file_text)

    for m in re.finditer(r'style="([^"]+)"', file_text):
        new_file_text = new_file_text.replace(
            m.group(0),
            style_str_to_react(m.group(1))
        )

    return new_file_text


def xml_attr_to_react(file_text: str):
    attr_to_react = {
        'xlink:actuate': 'xlinkActuate',
        'xlink:arcrole': 'xlinkArcrole',
        'xlink:href': 'xlinkHref',
        'xlink:role': 'xlinkRole',
        'xlink:show': 'xlinkShow',
        'xlink:title': 'xlinkTitle',
        'xlink:type': 'xlinkType',
        'xml:base': 'xmlBase',
        'xml:lang': 'xmlLang',
        'xml:space': 'xmlSpace',
    }

    new_file_text = copy(file_text)

    for k, v in attr_to_react.items():
        for m in re.finditer(f'{k}="([^"]+)"', file_text):
            new_file_text = new_file_text.replace(
                m.group(0),
                f'{v}="{m.group(1)}"'
            )

    return new_file_text


def replace_with_react_props(file_text: str):
    file_text = style_to_react(file_text)
    file_text = xml_attr_to_react(file_text)
    return file_text


def get_component_name(group):
    return group.get_id().title().replace('_', '').replace('-', '')


def get_component_file_contents(group: Group, comp_name: str,
                                bbox: BoundingBox):
    norm_width = bbox.width
    norm_height = bbox.height

    defs = [
        d for node in group.xpath('//*[contains(@style,"fill:url(#")]')
        for d in get_fill_defs(node)
    ]

    group = group.copy()
    drop_ids(group)

    group_str = group.tostring().decode('utf-8')

    defs_str = ''.join([
        d.tostring().decode('utf-8')
        for d in defs
    ])
    defs_str = textwrap.indent(
        f'{4*" "}<defs>\n{4*" "}{textwrap.indent(defs_str, 4*" ")}</defs>',
        8*" "
    ) if len(defs) > 0 else ""

    file_text = f'''import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";


const _{comp_name} = () => {{
    return (
        <g transform="translate({-bbox.left} {-bbox.top})">
{defs_str}
{textwrap.indent(group_str, 12*" ")}{4*" "}</g>
    );
}}

const {comp_name} = \
withSizePositionAngle(_{comp_name}, {norm_width}, {norm_height}, true);

export default {comp_name};'''

    return replace_with_react_props(file_text)


def get_component_dicts_in_layer(layer):
    comps = []

    for group in layer.xpath('svg:g'):
        comp_name = get_component_name(group)
        bbox = group.bounding_box()
        comps.append({
            'file_stem': group.get_id(),
            'comp_name': comp_name,
            'file_contents': get_component_file_contents(group,
                                                         comp_name,
                                                         bbox),
            'orig_bbox': bbox,
        })

    return comps


def get_component_dicts(svg, layers=None):
    return [
        comp_dict
        for i, layer in enumerate(svg.xpath('//svg:svg/svg:g'))
        for comp_dict in get_component_dicts_in_layer(layer)
        if (layers is None) or ((i + 1) in layers)
    ]


def comp_dict_to_drawing_child(comp_dict):
    bbox = comp_dict['orig_bbox']
    width = bbox.width
    height = bbox.height
    x = bbox.left
    y = bbox.top

    return (
        f'<{comp_dict["comp_name"]} width="{width}" height="{height}" '
        f'x="{x}" y="{y}" />'
    )


def comp_dicts_to_react_drawing(
    comp_dicts, drawing_name, width, height
):
    imports = [
        'import React from "react";',
        'import {SaveableDrawing as Drawing} '
        'from "components/shortcodes/drawing";'
    ]

    for d in comp_dicts:
        imports.append(
            f'import {d["comp_name"]} from "./{d["file_stem"]}";'
        )

    header = '\n'.join(imports)

    child_comps = [
        comp_dict_to_drawing_child(d)
        for d in comp_dicts
    ]

    children = textwrap.indent('\n'.join(child_comps),
                               12*" ")

    comp_def = f'''
const {drawing_name} = () => {{
    return (
        <Drawing xMin={{0}} xMax={{{width}}} yMin={{0}} yMax={{{height}}}>
{children}
        </Drawing>
    );
}};

export default {drawing_name};
'''

    return header + '\n\n' + comp_def


def svg_to_react(svg_path: Path, dest_path: Path, layers=None):
    with svg_path.open() as f:
        svg = load_svg(f).getroot()  # type: SvgDocumentElement

    if not dest_path.exists():
        dest_path.mkdir(parents=True)

    comp_dicts = get_component_dicts(svg, layers)

    for comp_dict in comp_dicts:
        (
            dest_path / f"{comp_dict['file_stem']}.tsx"
        ).write_text(comp_dict['file_contents'])

    drawing_txt = comp_dicts_to_react_drawing(
        comp_dicts,
        svg_path.stem.title().replace('_', ''),
        svg.width, svg.height
    )

    (
        dest_path / f"{svg_path.stem}.tsx"
    ).write_text(drawing_txt)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument(
        'src',
        help='The input svg'
    )
    parser.add_argument(
        'dest',
        help='The directory to write the React components to'
    )
    parser.add_argument(
        '--layers', '-l',
        help='Which layers to export',
        default="1"
    )

    args = parser.parse_args()

    src = Path(args.src)
    dest = Path(args.dest)
    layers = [
        int(x) for x in args.layers.split(',')
    ] if len(args.layers) > 0 else None

    svg_to_react(src, dest, layers)
