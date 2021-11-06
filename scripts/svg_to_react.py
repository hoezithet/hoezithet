#! /usr/bin/env python

import argparse
from copy import copy
from pathlib import Path
import re
import sys
import textwrap

sys.path.append('/usr/share/inkscape/extensions')

from inkex.elements import load_svg  # noqa
from ungroup_deep import UngroupDeep  # noqa

parser = argparse.ArgumentParser()

parser.add_argument(
    'src',
    help='The input svg'
)

parser.add_argument(
    'dest',
    help='The directory to write the React components to'
)

args = parser.parse_args()

src = Path(args.src)
dest = Path(args.dest)

with src.open() as f:
    svg = load_svg(f).getroot()

layer1 = svg.getElement('//svg:svg/svg:g')
groups = layer1.xpath('svg:g')


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


ungroup = UngroupDeep()
ungroup.parse_arguments(args=[])

for group in groups:
    g_id = group.get_id()
    drop_ids(group)
    bbox = group.bounding_box()
    norm_width = bbox.width
    norm_height = bbox.height

    group_str = group.tostring().decode('utf-8')
    class_name = g_id.title().replace('_', '').replace('-', '')

    defs = [
        d for node in group.xpath('//*[contains(@style,"fill:url(#")]')
        for d in get_fill_defs(node)
    ]
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


const _{class_name} = () => {{
    return (
        <g transform="translate({-bbox.left} {-bbox.top})">
{defs_str}
{textwrap.indent(group_str, 12*" ")}{4*" "}</g>
    );
}}

const {class_name} = \
withSizePositionAngle(_{class_name}, {norm_width}, {norm_height}, true);

export default {class_name};'''

    file_text = replace_with_react_props(file_text)

    if not dest.exists():
        dest.mkdir(parents=True)
    (dest / f'{g_id}.tsx').write_text(file_text)
