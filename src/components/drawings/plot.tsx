import React, { useContext, useEffect, useRef, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles';
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
    margin=0.05,
    xMin=-10, yMin=-10, xMax=10, yMax=10,
    xTicks=10, yTicks=10,
    xLabel="x", yLabel="y",
    xTickFormat=(d, i) => d, yTickFormat=(d, i) => d,
    xColor="gray", yColor="gray",
    xFontSize=14, yFontSize=14,
    axisMargin=0.05,
    maxWidth=500
}) => {
    // Wrapper class for Drawing + Axes
    const classes = useStyles();
    return (
        <Drawing maxWidth={maxWidth} aspect={aspect}
            margin={margin + axisMargin}
            left={xMin} bottom={yMin} right={xMax} top={yMax}
            className={classes.plot}>
            <Axes xTicks={xTicks} yTicks={yTicks}
                xLabel={xLabel} yLabel={yLabel}
                xTickFormat={xTickFormat} yTickFormat={yTickFormat}
                xColor={xColor} yColor={yColor}
                xFontSize={xFontSize} yFontSize={yFontSize}
                xAxisMargin={axisMargin} yAxisMargin={axisMargin}>
                {children} 
            </Axes>
        </Drawing>
    );
};
