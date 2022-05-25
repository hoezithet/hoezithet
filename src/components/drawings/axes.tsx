import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import { getColor } from "../../colors";
import { Annot } from "./annot";

const useStyles = makeStyles({
    tick: {
        '& text': {
            fontFamily: "Quicksand,sans-serif",
        },
        '& path': {
            strokeWidth: 2,
            strokeLinecap: "round",
        }
    },
    xTick: {
        '& text': {
            fontSize: props => props.xFontSize,
            fill: props => props.xColor,
        },
        '& path': {
            stroke: props => props.xColor,
        }
    },
    yTick: {
        '& text': {
            fontSize: props => props.yFontSize,
            fill: props => props.yColor,
        },
        '& path': {
            stroke: props => props.yColor,
        }
    },
    axisLine: {
        strokeWidth: 2,
        strokeLinecap: "round",
    },
    xAxisLine: {
        stroke: props => props.xColor,
    },
    yAxisLine: {
        stroke: props => props.yColor,
    },
    axisLabel: {
        fontFamily: "Quicksand,sans-serif",
        fontSize: 20,
    },
    xAxisLabel: {
        color: props => `${props.xColor}`,
    },
    yAxisLabel: {
        color: props => `${props.yColor}`,
    }
});

const Ticks = ({
    scale, numTicks=10, isVertical=false, tickClassName="",
    tickLength=5,
    labelMargin=5,
    tickFormat=x => x.toFixed(),
}) => {
    const ticksValues = scale.ticks(numTicks);//Array.from({length: numTicks}, (_, i) => start + step * i);
    const d = ticksValues.map(x => isVertical ? `M 0 ${scale(x)} h ${-tickLength}` : `M ${scale(x)} 0 v ${tickLength}`).join(" ");
    return (
        <g className={tickClassName}>
            <path d={d}/>
            {
                ticksValues.map((x, i) =>
                    <text x={isVertical ? - tickLength - labelMargin : scale(x)} y={isVertical ? scale(x) : tickLength + labelMargin} key={i} textAnchor={isVertical ? "end" : "middle"} alignmentBaseline={isVertical ? "middle" : "hanging"}>{ tickFormat(x) }</text>
                )
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

    const {xScale, yScale, width, height} = useContext(DrawingContext);
    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();
    xAxisMargin = xAxisMargin*width;
    yAxisMargin = yAxisMargin*height;
    
    const classes = useStyles({
        xFontSize: xFontSize,
        yFontSize: yFontSize,
        xColor: getColor(xColor),
        yColor: getColor(yColor),
    });
    
    return (
        <>
            <g transform={`translate(${xScale(0)} 0)`}>
                <Ticks scale={yScale} numTicks={yTicks} tickFormat={yTickFormat} isVertical tickClassName={`${classes.tick} ${classes.yTick}`}/>
                <ArrowLine xStart={0} yStart={yScale(yMin) + yAxisMargin} xEnd={0} yEnd={yScale(yMax) - yAxisMargin} color={yColor} />
                <Annot x={10} y={yScale(yMax) - yAxisMargin} align="top left" className={classes.yAxisLabel}>
                    { yLabel }
                </Annot>
            </g>
            <g transform={`translate(0 ${yScale(0)})`}>
                <Ticks scale={xScale} numTicks={xTicks} tickFormat={xTickFormat} tickClassName={`${classes.tick} ${classes.xTick}`}/>
                <ArrowLine xStart={xScale(xMin) - xAxisMargin} yStart={0} xEnd={xScale(xMax) + xAxisMargin} yEnd={0} color={xColor} />
                <Annot x={xScale(xMax) + xAxisMargin} y={-5} align="bottom right" className={classes.xAxisLabel}>
                    { xLabel }
                </Annot>
            </g>
            { children }
        </>
    );
}
