import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { getColor } from "../../colors";
import { Drawing } from "./drawing";
import { Axes } from "./axes";


const useStyles = makeStyles({
    plot: {
        display: "block",
        margin: "auto"
    },
});

export const Plot = ({
    children=null,
    aspect=1.0,
    topMargin=0.05, rightMargin=0.05, bottomMargin=0.05, leftMargin=0.05,
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
            leftMargin={leftMargin + xAxisMargin} rightMargin={rightMargin + xAxisMargin} topMargin={topMargin + yAxisMargin} bottomMargin={bottomMargin + yAxisMargin}
            left={xMin} bottom={yMin} right={xMax} top={yMax}
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
