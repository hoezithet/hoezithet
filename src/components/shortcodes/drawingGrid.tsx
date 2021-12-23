import React, { useContext } from 'react';
import _ from "lodash";

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";


type GridLineProps = {
    i: number,
    scale: (number) => number,
    length: number,
    direction: 'h' | 'v',
    showText: boolean,
    color: string,
    opacity: number,
    lineWidth: number,
};

const GridLine = ({
    i, scale, length, direction, showText=false,
    color, opacity, lineWidth
}: GridLineProps) => {
    return (
        <>
          <path d={`M ${direction === 'v' ? scale(i) : 0},${direction === 'h' ? scale(i) : 0} ${direction} ${length}`} stroke={color} strokeWidth={lineWidth} strokeOpacity={opacity} />
          { showText ?
              <text x={direction === 'v' ? scale(i) : 0} y={direction === 'h' ? scale(i) : length} fill={color}>{ i }</text>
              : null
          }
        </>
    );
};

type GridLinesProps = {
    start: number,
    end: number,
    step: number,
    scale: (number) => number,
    length: number,
    direction: 'h' | 'v',
    showText: boolean,
    color: string,
    opacity: number,
    lineWidth: number,
};


const GridLines = ({
    start, end, step, scale, length, direction,
    showText=false, color, opacity, lineWidth
}: GridLinesProps) => {
    return (
        <>
        {
            _.range(Math.floor(start), Math.ceil(end) + 1, step*(start < end ? 1 : -1)).map(i =>
                <g key={i}>
                  <GridLine i={i} scale={scale} length={length} direction={direction}
                     color={color} lineWidth={lineWidth} opacity={opacity} showText={showText} />
                </g>
            )
        }
        </>
    );
};

const DrawingGrid = ({color="blue", majorX=10, majorY=10, minorX=1, minorY=1, opacity=0.1, lineWidth=1}) => {
    const {xScale, yScale, width, height} = useContext(DrawingContext);
    color = getColor(color);

    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();

    return (
        <g>
          <GridLines start={xMin} end={xMax} step={minorX} scale={xScale} length={height} direction='v'
            color={color} lineWidth={lineWidth} opacity={opacity} /> 
          <GridLines start={xMin} end={xMax} step={majorX} scale={xScale} length={height} direction='v'
            color={color} lineWidth={2*lineWidth} opacity={opacity} showText />
          <GridLines start={yMin} end={yMax} step={minorY} scale={yScale} length={width} direction='h'
            color={color} lineWidth={lineWidth} opacity={opacity} /> 
          <GridLines start={yMin} end={yMax} step={majorY} scale={yScale} length={width} direction='h'
            color={color} lineWidth={2*lineWidth} opacity={opacity} showText />
        </g>
    );
};

export default DrawingGrid;
