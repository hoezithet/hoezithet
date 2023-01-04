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
    linewidth: number,
};

const GridLine = ({
    i, scale, length, direction, showText=false,
    color, opacity, linewidth
}: GridLineProps) => {
    return (
        <>
          <path d={`M ${direction === 'v' ? scale(i) : 0},${direction === 'h' ? scale(i) : 0} ${direction} ${length}`} stroke={color} strokeWidth={linewidth} strokeOpacity={opacity} />
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
    linewidth: number,
};


const GridLines = ({
    start, end, step, scale, length, direction,
    showText=false, color, opacity, linewidth
}: GridLinesProps) => {
    return (
        <>
        {
            _.range(Math.floor(start), Math.ceil(end) + 1, step*(start < end ? 1 : -1)).map(i =>
                <g key={i}>
                  <GridLine i={i} scale={scale} length={length} direction={direction}
                     color={color} linewidth={linewidth} opacity={opacity} showText={showText} />
                </g>
            )
        }
        </>
    );
};

const DrawingGrid = ({color="light_gray", major=null, minor=null, opacity=1.0, linewidth=1.0, majorX=null, majorY=null, minorX=null, minorY=null, majorOpacity=null, minorOpacity=null, minorLinewidth=null, majorLinewidth=null, showText=false}) => {
    majorX = majorX === null ? major : majorX;
    majorY = majorY === null ? major : majorY;
    majorOpacity = majorOpacity === null ? opacity : majorOpacity;
    majorLinewidth = majorLinewidth === null ? linewidth : majorLinewidth;
    minorX = minorX === null ? minor : minorX;
    minorY = minorY === null ? minor : minorY;
    minorOpacity = minorOpacity === null ? opacity : minorOpacity;
    minorLinewidth = minorLinewidth === null ? linewidth/2 : minorLinewidth;

    const {xScale, yScale, width, height} = useContext(DrawingContext);
    color = getColor(color);

    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();

    return (
        <g>
          { minorX !== null ?
            <GridLines start={xMin} end={xMax} step={minorX} scale={xScale} length={height} direction='v'
            color={color} linewidth={minorLinewidth} opacity={minorOpacity} />
            : null }
          { majorX !== null ?
          <GridLines start={xMin} end={xMax} step={majorX} scale={xScale} length={height} direction='v'
            color={color} linewidth={majorLinewidth} opacity={majorOpacity} showText={showText} />
            : null }
          { minorY !== null ?
          <GridLines start={yMin} end={yMax} step={minorY} scale={yScale} length={width} direction='h'
            color={color} linewidth={minorLinewidth} opacity={minorOpacity} />
            : null }
          { majorY !== null ?
          <GridLines start={yMin} end={yMax} step={majorY} scale={yScale} length={width} direction='h'
            color={color} linewidth={majorLinewidth} opacity={majorOpacity} showText={showText} />
            : null }
        </g>
    );
};

export default DrawingGrid;
