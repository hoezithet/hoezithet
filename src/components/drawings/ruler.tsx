import React, { useContext } from 'react';
import _ from "lodash";

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { StyledPath } from "./line";
import useId from 'hooks/useId';

const Ruler = ({x=0, y=0, angle=0, size=30, major=10, emphasize=null, unit="m", color="yellow", tickColor="dark_gray", opacity=1, lineWidth=1}) => {
    const {xScale, yScale} = useContext(DrawingContext);
    color = getColor(color);
    tickColor = getColor(tickColor);
    const tickMargin = 20;
    const majorTickLength = 10;
    const minorTickLength = 5;
    const rulerHeight = 40;
    const rulerRx = 3;

    size = Math.ceil(size);
    const angle_rad = angle*Math.PI/180;
    const xSize = size * Math.cos(angle_rad)
    const ySize = size * Math.sin(angle_rad)
    const xScaledSize = xScale(xSize) - xScale(0);
    const yScaledSize = yScale(ySize) - yScale(0);
    const scaledSize = Math.sqrt(Math.pow(xScaledSize, 2) + Math.pow(yScaledSize, 2))
    const width = scaledSize + 2*tickMargin;

    const rulerId = useId();

    const rulerRect = (
        <rect x={-tickMargin} y="0" width={width} height={rulerHeight} id={rulerId} rx={rulerRx} fill={color}/>
    );
    return (
        <>
        <g transform={`translate(${xScale(x)} ${yScale(y)}) rotate(${angle})`} >
            <clipPath id="rulerClip">
                { rulerRect }
            </clipPath>
            <use xlinkHref={`#${rulerId}`}  />
            <g clipPath="url(#rulerClip)">
            {
                _.range(0, size + 1).map(i => {
                    const xPos = scaledSize*i/size;
                    const isMajor = major && i % major === 0;
                    const isSemiMajor = major && i*2 % major === 0;
                    const isEmphasize = i === emphasize;
                    return (
                    <g key={i}>
                        <StyledPath d={`M ${xPos},0 v ${isMajor || isSemiMajor ? majorTickLength : minorTickLength}`}
                            tickColor={tickColor} strokeWidth={isEmphasize ? 2*lineWidth : lineWidth} strokeOpacity={opacity} />
                        { isMajor ?
                          <text x={xPos} y={majorTickLength} fontSize="x-small"
                                fill={tickColor}
                                alignmentBaseline="baseline" dominantBaseline="hanging"
                                textAnchor="middle" fontWeight={isEmphasize ? "bold" : "normal"}>
                              { i }
                          </text>
                          : null }
                    </g>
                    )
                })
            }
            <text x={0} y={rulerHeight - minorTickLength} fontSize="x-small"
                fill={tickColor}>{ unit }</text>
            </g>
        </g>
        </>
    );
};

export default Ruler;
