import React, { useContext } from 'react';

import { DrawingContext } from "./drawing";
import { getColor } from "../../colors";

type MassProps = {
    x: number,
    y: number,
    angle?: number,
    size?: number,
    fill?: string,
    ringFill?: string,
    text?: string,
    textFill?: string,
}

const Mass = ({x, y, angle=0, size=10, fill="black", ringFill="black", text="", textFill="near_white"}: MassProps) => {
    const {xScale, yScale} = useContext(DrawingContext);
    fill = getColor(fill);
    textFill = getColor(textFill);
    ringFill = getColor(ringFill);

    x = xScale(x);
    y = yScale(y);
    size = xScale(size) - xScale(0);

    const topWidth = size*2/3;
    const strokeWidth = size/10;
    const bottomWidth = size;
    const height = size*3/4;
    const ringRadius = 5;
    const ringWidth = 3;

    return (
        <g transform={`translate(${x} ${y}) rotate(${angle})`} >
            <circle cx="0" cy={`${ringRadius}`} r={ringRadius} fill="none" stroke={ringFill} strokeWidth={ringWidth} />
            <g transform={`translate(0 ${ringRadius})`}>
                <g transform={`translate(${-size/2} ${height + strokeWidth/2})`} >
                    <path d={`M 0,0 L ${size*1/5},${-height} h ${size*3/5} L ${size},0 z`}
                        fill={fill} stroke={fill} strokeWidth={strokeWidth}
                        strokeLinejoin="round"/>
                    <text x={size/2} y={-height/2} fill={textFill} textAnchor="middle" dominantBaseline="middle" fontSize="x-small">
                        { text }
                    </text>
                </g>
            </g>
        </g>
    );
};

export default Mass;
