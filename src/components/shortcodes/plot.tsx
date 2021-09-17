import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { getColor } from "../../colors";
import { Drawing } from "./drawing";
import { Axes } from "./axes";
import withSave from "../withSave";


const useStyles = makeStyles({
    plot: {
        display: "block",
        margin: "auto"
    },
});

export const Plot = ({
    children=null,
    aspect=1.0,
    top=0.05, right=0.05, bottom=0.05, left=0.05,
    xMin=-10, yMin=-10, xMax=10, yMax=10,
    xTicks=10, yTicks=10,
    xLabel="x", yLabel="y",
    xTickFormat=(d, i) => d, yTickFormat=(d, i) => d,
    xColor="gray", yColor="gray",
    xFontSize=14, yFontSize=14,
    xAxisMargin=0.05, yAxisMargin=0.05,
    maxWidth=500
}) => {
    // Wrapper class for Drawing + Axes
    const classes = useStyles();
    return (
        <Drawing maxWidth={maxWidth} aspect={aspect}
            left={left + xAxisMargin} right={right + xAxisMargin} top={top + yAxisMargin} bottom={bottom + yAxisMargin}
            xMin={xMin} yMin={yMin} xMax={xMax} yMax={yMax}
            className={classes.plot}>
            <Axes xTicks={xTicks} yTicks={yTicks}
                xLabel={xLabel} yLabel={yLabel}
                xTickFormat={xTickFormat} yTickFormat={yTickFormat}
                xColor={xColor} yColor={yColor}
                xFontSize={xFontSize} yFontSize={yFontSize}
                xAxisMargin={xAxisMargin} yAxisMargin={yAxisMargin}>
                {children} 
            </Axes>
        </Drawing>
    );
};

export const SaveablePlot = withSave(Plot, ".png");