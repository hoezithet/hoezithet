import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import { getColor } from "../../colors";
import { Annot } from "./annot";

const useStyles = makeStyles({
    tick: {
        '& text': {
            fontFamily: "Quicksand,sans-serif",
        },
        '& line': {
            strokeWidth: 2,
            strokeLinecap: "round",
        }
    },
    xTick: {
        '& text': {
            fontSize: props => props.xFontSize,
            fill: props => props.xColor,
        },
        '& line': {
            stroke: props => props.xColor,
        }
    },
    yTick: {
        '& text': {
            fontSize: props => props.yFontSize,
            fill: props => props.yColor,
        },
        '& line': {
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
            <Group left={xScale(0)}>
                <AxisLeft scale={yScale} numTicks={yTicks} tickFormat={yTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.yTick}`}/>
                <ArrowLine xStart={0} yStart={yScale(yMin) + yAxisMargin} xEnd={0} yEnd={yScale(yMax) - yAxisMargin} color={yColor} useContextScale={false} />
                <Annot x={10} y={yScale(yMax) - yAxisMargin} hAlign="left" vAlign="top" useContextScale={false} className={classes.yAxisLabel}>
                    { yLabel }
                </Annot>
            </Group>
            <Group top={yScale(0)}>
                <AxisBottom scale={xScale} numTicks={xTicks} tickFormat={xTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.xTick}`}/>
                <ArrowLine xStart={xScale(xMin) - xAxisMargin} yStart={0} xEnd={xScale(xMax) + xAxisMargin} yEnd={0} color={xColor} useContextScale={false}/>
                <Annot x={xScale(xMax) + xAxisMargin} y={-5} hAlign="right" vAlign="bottom" useContextScale={false} className={classes.xAxisLabel}>
                    { xLabel }
                </Annot>
            </Group>
            { children }
        </>
    );
}