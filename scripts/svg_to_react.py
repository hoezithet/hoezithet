#! /usr/bin/python3

import argparse
from pathlib import Path
import sys
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

def style_str_to_attrs(node):
    for el in node.xpath('*[@style]'):
        for style in el.findone('@style').split(';'):
            k, v = style.split(':')
            el.set(k, v)
        el.pop('style')
    return node

def drop_id(node):
    node.pop('id')

def drop_ids(node):
    for el in node.xpath('*[@id]'):
        el.pop('id')
    return node

ungroup = UngroupDeep()
ungroup.parse_arguments(args=[])

norm_width = 100
norm_height = 100

for group in groups:
    g_id = group.get_id()
    bbox = group.bounding_box()
    children = list(group)

    group.set('transform', f'scale({norm_width/bbox.width} {norm_height/bbox.height}) translate({-bbox.left} {-bbox.top})')
    ungroup._deep_ungroup(group)

    new_children = []

    for child in children:
        new_child = child.to_path_element()
        new_child.apply_transform()
        new_children.append(new_child)
 
    children_str = '\n'.join([
        c.tostring().decode('utf-8')
        for c in new_children
    ])

    class_name = g_id.title()
    props_name = f'{class_name}Props'

    file_text = f'''
import React from "react";

type {props_name} = {{
    width: number|null,
    height: number|null,
    x: number,
    y: number
}}

const {class_name} = ({{width=null, height=null, x, y}}: {props_name}) => {{
    let xScale, yScale;

    if (width === null && height !== null) {{
	yScale = height / {norm_height};
        xScale = yScale
    }} else if (height === null && width !== null) {{
	xScale = width / {norm_width};
        yScale = xScale
    }} else if (width !== null && height !== null) {{
	xScale = width / {norm_width};
	yScale = height / {norm_height};
    }} else {{
        xScale = 1;
        yScale = 1;
    }}

    const xShift = props.x;
    const yShift = props.y;

    return (
        <g transform={{`scale(${{xScale}} ${{yScale}}) translate(${{xShift}} ${{yShift}})`}}>
            {children_str}
        </g>
    );
}}

export default {class_name};
'''
    print(file_text)
