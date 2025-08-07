import React, { useContext } from 'react';

import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import { getColor } from "../../colors";
import { Annot } from "./annot";

const Ticks = ({
    scale, numTicks=10, isVertical=false,
    tickLength=5,
    labelMargin=5,
    tickFormat=(tickValue: number, tickX: number, tickY: number, isVertical: boolean) => tickValue.toFixed(),
    color=null,
    fontSize="12px",
}) => {
    const ticksValues = scale.ticks(numTicks);//Array.from({length: numTicks}, (_, i) => start + step * i);
    const d = ticksValues.map(x => isVertical ? `M 0 ${scale(x)} h ${-tickLength}` : `M ${scale(x)} 0 v ${tickLength}`).join(" ");
    return (
        <g>
            <path d={d} stroke={color} strokeLinecap="round" strokeWidth="2px"/>
            {
                ticksValues.map((tickValue, i) => {
                    const tickX = isVertical ? - tickLength - labelMargin : scale(tickValue);
                    const tickY = isVertical ? scale(tickValue) : tickLength + labelMargin;
                    const tickLabel = tickFormat(tickValue, tickX, tickY, isVertical);
                    if (
                        typeof tickLabel === 'string' || tickLabel instanceof String
                        || typeof tickLabel === 'number' || tickLabel instanceof Number
                    ) {
                        return <text x={tickX} y={tickY} key={i} textAnchor={isVertical ? "end" : "middle"} fill={color} fontSize={fontSize} dominantBaseline={isVertical ? "middle" : "hanging"}>{ tickLabel }</text>;
                    } else {
                        return <React.Fragment key={i}>{tickLabel}</React.Fragment>;
                    }
                })
            }
        </g>
    );
};


export const Axes = ({
    children=null,
    xTicks, yTicks,
    xLabel, yLabel,
    xTickFormat, yTickFormat,
    xColor, yColor,
    xFontSize, yFontSize,
    xAxisMargin, yAxisMargin
}) => {
    /**
  d3.formatDefaultLocale({
    "decimal": ",",
    "thousands": " ",
    "grouping": [3],
    "currency": ["€\u00a0", ""]
  })
     **/
    xColor = getColor(xColor);
    yColor = getColor(yColor);

    const {xScale, yScale, width, height} = useContext(DrawingContext);
    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();
    xAxisMargin = xAxisMargin*width;
    yAxisMargin = yAxisMargin*height;
    
    return (
        <>
            <g transform={`translate(${xScale(0)} 0)`}>
                <Ticks scale={yScale} numTicks={yTicks} tickFormat={yTickFormat} isVertical color={yColor} fontSize={yFontSize}/>
                <ArrowLine xStart={0} yStart={yScale(yMin) + yAxisMargin} xEnd={0} yEnd={yScale(yMax) - yAxisMargin} color={yColor} />
                <Annot x={10} y={yScale(yMax) - yAxisMargin} align="top left" color={yColor}>
                    { yLabel }
                </Annot>
            </g>
            <g transform={`translate(0 ${yScale(0)})`}>
                <Ticks scale={xScale} numTicks={xTicks} tickFormat={xTickFormat} color={xColor} fontSize={xFontSize}/>
                <ArrowLine xStart={xScale(xMin) - xAxisMargin} yStart={0} xEnd={xScale(xMax) + xAxisMargin} yEnd={0} color={xColor} />
                <Annot x={xScale(xMax) + xAxisMargin} y={-5} align="bottom right" color={xColor}>
                    { xLabel }
                </Annot>
            </g>
            { children }
        </>
    );
}
