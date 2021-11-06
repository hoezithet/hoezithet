#! /usr/bin/python3

import argparse
from pathlib import Path
import re
import sys
import textwrap

sys.path.append('/usr/share/inkscape/extensions')

from inkex.elements import load_svg
from ungroup_deep import UngroupDeep

from bs4 import BeautifulSoup

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

from inkex.elements._base import NodeBasedLookup

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

ungroup = UngroupDeep()
ungroup.parse_arguments(args=[])

for group in groups:
    g_id = group.get_id()
    bbox = group.bounding_box()
    norm_width = bbox.width
    norm_height = bbox.height

    group_str = group.tostring().decode('utf-8')
    class_name = g_id.title().replace('_', '').replace('-', '')
    
    defs = [d
        for node in group.xpath('//*[contains(@style,"fill:url(#")]')
        for d in get_fill_defs(node)
    ]
    defs_str = ''.join([
        d.tostring().decode('utf-8')
        for d in defs
    ])
    defs_str = textwrap.indent(f'{4*" "}<defs>\n{4*" "}{textwrap.indent(defs_str, 4*" ")}</defs>', 8*" ") if len(defs) > 0 else ""

    file_text = f'''import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";


const _{class_name} = () => {{
    return (
        <g transform="translate({-bbox.left} {-bbox.top})">
{defs_str}
{textwrap.indent(group_str, 12*" ")}{4*" "}</g>
    );
}}

const {class_name} = withSizePositionAngle(_{class_name}, {norm_width}, {norm_height}, true);

export default {class_name};'''

    if not dest.exists():
        dest.mkdir(parents=True)
    (dest / f'{g_id}.tsx').write_text(file_text)