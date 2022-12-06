#! /usr/bin/env python

import argparse
from copy import copy
from pathlib import Path
import re
import sys
from textwrap import indent, dedent

sys.path.append('/usr/share/inkscape/extensions')

from inkex.elements import load_svg, Group, SvgDocumentElement  # noqa
from inkex import BoundingBox  # noqa
from inkex.base import SvgOutputMixin
from lxml import etree


overwrite_all = False

def kebab_to_camel(kebab):
    return ''.join([w.title() if i > 0 else w
                    for i, w in enumerate(kebab.split('-'))])


def drop_id(node):
    node.pop('id')


def drop_ids(node, root):
    for el in node.xpath('.//*[@id]'):
        if len(root.xpath(f'//*[contains(@fill|@clip-path|@xlink:href,"#{el.get_id()}")]')) == 0:
            el.pop('id')
    return node


def get_linked_nodes(node):
    if node.href is not None:
        return [node, *get_linked_nodes(node.href)]
    else:
        return [node]


def get_prop_defs(node, prop_value):
    if prop_value is None or len(prop_value) < 3 or prop_value[:3] != 'url':
        return []
    else:
        linked_node = node.root.getElementById(prop_value)
        return [linked_node, *get_linked_nodes(linked_node)]


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

    new_file_text = file_text

    for k, v in attr_to_react.items():
        for m in re.finditer(f'{k}="([^"]+)"', file_text):
            new_file_text = new_file_text.replace(
                m.group(0),
                f'{v}="{m.group(1)}"'
            )

    return new_file_text


def drop_inkscape_attrs(file_text: str):
    new_file_text = file_text

    patterns = [
        'inkscape:',
        'sodipodi:',
        'vectorEffect',
        'fontVariationSettings',
        'inlineSize',
        'whiteSpace',
        'textDecorationColor',
        'textDecorationLine',
        'textAlign',
        'lineHeight',
    ]
    for p in patterns:
        for m in re.finditer(f'{p}[^=]*="[^"]+" ?', file_text):
            new_file_text = new_file_text.replace(m.group(0), '')
    return new_file_text


def replace_with_react_props(file_text: str):
    file_text = style_to_react(file_text)
    file_text = xml_attr_to_react(file_text)
    file_text = file_text.replace('clip-path=', 'clipPath=')
    file_text = drop_inkscape_attrs(file_text)
    return file_text


def get_component_name(group):
    return group.get_id().title().replace('_', '').replace('-', '')


def pretty_tostring(el):
    svg = SvgOutputMixin.get_template(width=0, height=0).getroot()
    svg.append(el.copy())
    etree.indent(svg)
    out = etree.tostring(svg, pretty_print=True)
    out = out.split(b">\n", 1)[-1][:-8]
    return out


def get_component_file_contents(group: Group, comp_name: str,
                                bbox: BoundingBox):
    norm_width = bbox.width
    norm_height = bbox.height

    # Search for fill path defs
    defs = [
        d
        for node in group.xpath(f'.//*[contains(@style,"fill:url(#")]')
        for d in get_prop_defs(node, node.style['fill'])
    ]

    # Search for clip path defs
    defs.extend(
        d for clipPathValue in group.xpath(".//@clip-path")
        for d in get_prop_defs(group, clipPathValue)
    )

    defs = set(defs)

    root = group.root
    group = group.copy()
    drop_ids(group, root)

    group_str = pretty_tostring(group).decode('utf-8')
    group_str = dedent(4*" " + group_str.strip())

    def_strs = []

    for d in defs:
        d_id = d.get_id()
        d = d.copy()
        drop_ids(d, root)
        d_str = pretty_tostring(d).decode('utf-8')
        m = re.match(r'<([^>]+)id="[^"]+"([^>]+)>', d_str.split('\n')[0])
        if m is None:
            d_str = re.sub(
                r'<([^/>]+)(/?>)',
                f'<\\1 id="{d_id}"\\2',
                d_str, count=1
            )
        def_strs.append(d_str)

    defs_str = '\n'.join(def_strs)
    defs_str = (
        f'<defs>\n{indent(dedent(2*" " + defs_str.strip()), 2*" ")}\n</defs>\n'
    ) if len(defs) > 0 else ""

    child = indent(defs_str + group_str.strip(), 14*" ")

    id_dict = {
        m: f'id{i}'
        for i, m in enumerate(re.findall(r'\bid="([^"]+)"', child))
    }

    id_defs = indent('\n'.join(
        f'const {repl} = useId();'
        for repl in id_dict.values()
    ), 8*" ");
    if len(id_defs) > 0:
      id_defs = f'\n{id_defs}\n'

    file_text = dedent(f'''
    import React from "react";
    import withSizePositionAngle from "components/withSizePositionAngle";
    {"import useId from 'hooks/useId';" if len(id_defs) > 0 else ""}
    
    const _{comp_name} = () => {{{id_defs}
        return (
            <g transform="translate({-bbox.left:.6f} {-bbox.top:.6f})">\n{child}
            </g>
        );
    }}
    
    const {comp_name} = withSizePositionAngle(_{comp_name}, {norm_width:.6f}, {norm_height:.6f});
    
    export default {comp_name};
    ''')[1:-1]

    file_text = replace_with_react_props(file_text)

    for id, repl in id_dict.items():
        file_text = re.sub(f'\\bid="{id}"', f"id={{{repl}}}", file_text)
        file_text = re.sub(f'="([^"]*)#{id}([^"]*)"', f'={{`\\1#${{{repl}}}\\2`}}', file_text)

    return file_text


def get_component_dicts_in_layer(layer):
    comps = []

    groups = list(layer)

    for group in groups:
        comp_name = get_component_name(group)
        global_bbox = group.bounding_box(layer.transform)
        local_bbox = group.bounding_box()

        comps.append({
            'file_stem': group.get_id(),
            'comp_name': comp_name,
            'file_contents': get_component_file_contents(group,
                                                         comp_name,
                                                         local_bbox),
            'orig_bbox': global_bbox,
        })

    return comps


def get_component_dicts(svg, layers=None):
    return [
        comp_dict
        for i, layer in enumerate(svg.xpath('//svg:svg/svg:g'))
        for comp_dict in get_component_dicts_in_layer(layer)
        if (layers is None) or ((i + 1) in layers)
    ]


def comp_dict_to_drawing_child(comp_dict, shiftX=0.0, shiftY=0.0, scale=1.0):
    bbox = comp_dict['orig_bbox']
    width = bbox.width * scale
    height = bbox.height * scale
    x = bbox.left * scale + shiftX
    y = bbox.top * scale + shiftY

    return (
        f'<{comp_dict["comp_name"]} '
        f'width={{xScale.metric({width:.6f})}} height={{yScale.metric({height:.6f})}} '
        f'x={{xScale({x:.6f})}} y={{yScale({y:.6f})}} />'
    )


def comp_dicts_to_react_drawing(
    comp_dicts, drawing_name, dest_path, svg
):
    imports = [
        'import React from "react";',
        'import { Drawing, DrawingContext } '
        'from "components/drawings/drawing";',
    ]

    for d in comp_dicts:
        imports.append(
            f'import {d["comp_name"]} from "./{dest_path.name}/{d["file_stem"]}";'
        )

    header = '\n'.join(imports)

    width, height = svg.viewport_width, svg.viewport_height
    scale = svg.scale
    left, top, vb_width, vb_height = svg.get_viewbox()

    child_comps = [
        comp_dict_to_drawing_child(d, -left, -top, scale)
        for d in comp_dicts
    ]

    children_str = indent("\n".join(child_comps), 10*" ")

    comp_def = f'''
const _{drawing_name} = () => {{
    const {{xScale, yScale}} = React.useContext(DrawingContext);

    return (
        <>\n{children_str}
        </>
    );
}};

const {drawing_name} = () => {{
    return (
        <Drawing top={{{0}}} left={{{0}}} right={{{width}}} bottom={{{height}}}>
            <_{drawing_name}/>
        </Drawing>
    );
}};

export default {drawing_name};'''

    return header + '\n\n' + comp_def


def write_text_to_file(dest_path, text):
    global overwrite_all

    if dest_path.exists() and not overwrite_all:
        allowWrite = input(
            f'File {dest_path.name} exists (at {dest_path}). '
            'Overwrite? [y/N/a] '
        ).lower()

        if allowWrite == 'n':
            fname = input(
                'Please enter a different filename: '
            )
            dest_path = dest_path.parent / fname
            return write_text_to_file(dest_path, text)
        elif allowWrite == 'a':
            overwrite_all = True
        elif not allowWrite == 'y':
            return write_text_to_file(dest_path, text)

    dest_path.write_text(text)
    return dest_path.stem


def svg_to_react(svg_path: Path, dest_path: Path, layers=None):
    with svg_path.open() as f:
        svg = load_svg(f).getroot()  # type: SvgDocumentElement

    if not dest_path.exists():
        dest_path.mkdir(parents=True)

    comp_dicts = get_component_dicts(svg, layers)

    for comp_dict in comp_dicts:
        new_stem = write_text_to_file(
            dest_path / f"{comp_dict['file_stem']}.tsx",
            comp_dict['file_contents']
        )
        comp_dict['file_stem'] = new_stem

    drawing_txt = comp_dicts_to_react_drawing(
        comp_dicts,
        svg_path.stem.title().replace('_', ''),
        dest_path, svg
    )

    write_text_to_file(
        dest_path.parent / f"{svg_path.stem}.tsx",
        drawing_txt
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument(
        'src',
        help='The input svg'
    )
    parser.add_argument(
        '--dest',
        help='The directory to write the React components to',
        default=None
    )
    parser.add_argument(
        '--layers', '-l',
        help='Which layers to export',
        default="1"
    )
    parser.add_argument(
        '--force', '-f',
        help='If set, overwrite all existing files.',
        action="store_true"
    )

    args = parser.parse_args()

    src = Path(args.src)
    dest = Path(args.dest) if args.dest is not None else src.parent / src.stem
    overwrite_all = args.force
    layers = [
        int(x) for x in args.layers.split(',')
    ] if len(args.layers) > 0 else None

    svg_to_react(src, dest, layers)
