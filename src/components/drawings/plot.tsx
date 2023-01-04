import React, { useContext, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system';

import { getColor } from "colors";
import { Drawing } from "./drawing";
import { Axes } from "./axes";
import DrawingGrid from "./drawingGrid";


const PlotDrawing = styled(Drawing)({
    display: 'block',
    margin: 'auto',
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
    maxWidth=500, gridProps=null
}) => {
    // Wrapper class for Drawing + Axes
    return (
        <PlotDrawing maxWidth={maxWidth} aspect={aspect}
            margin={margin + axisMargin}
            left={xMin} bottom={yMin} right={xMax} top={yMax}>
            {
              gridProps !== null ?
              <DrawingGrid {...gridProps} />
              : null
            }
            <Axes xTicks={xTicks} yTicks={yTicks}
                xLabel={xLabel} yLabel={yLabel}
                xTickFormat={xTickFormat} yTickFormat={yTickFormat}
                xColor={xColor} yColor={yColor}
                xFontSize={xFontSize} yFontSize={yFontSize}
                xAxisMargin={axisMargin} yAxisMargin={axisMargin}>
                {children} 
            </Axes>
        </PlotDrawing>
    );
};
