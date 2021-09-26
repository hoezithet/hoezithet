import React, { useContext } from 'react';
import _ from "lodash";

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { useStyles } from "./line";

const Wall = ({x=0, y=0, angle=0, width, height, fill="light_gray", stroke="dark_gray", strokeWidth=3, opacity=1}) => {
    const {xScale, yScale} = useContext(DrawingContext);
    fill = getColor(fill);
    stroke = getColor(stroke);
    const scaledWidth = Math.abs(xScale(width) - xScale(0));
    const scaledHeight = Math.abs(yScale(height) - yScale(0));

    const gradId = _.uniqueId("gradient-");

    return (
        <g transform={`translate(${xScale(x)} ${yScale(y)}) rotate(${angle})`} >
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={fill} stopOpacity="0" />
                <stop offset="25%" stopColor={fill} />
            </linearGradient>
            <rect y={-scaledHeight} width={scaledWidth} height={scaledHeight} fill={`url(#${gradId})`} />
            <path d={`M 0,0 h ${scaledWidth}`} stroke={stroke} strokeWidth={strokeWidth} />
        </g>
    );
};

export default Wall;
