import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Line, LinePath, Circle } from '@visx/shape';
import { curveLinear } from '@visx/curve';

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { useStyles } from "./line";


export const Fx = ({fx, nSamples=null, xStart=null, xEnd=null, color="blue", opacity=1, lineWidth=3}) => {
    const classes = useStyles({color: getColor(color), lineWidth: lineWidth, opacity: opacity});
    const {xScale, yScale, xMargin, yMargin} = useContext(DrawingContext);
    const [xMin, xMax] = xScale.domain();
    xStart = xStart === null ? xMin - 0.5*(xMax - xMin) : xStart;
    xEnd = xEnd === null ? xMax + 0.5*(xMax - xMin) : xEnd;
    nSamples = nSamples ? Math.round(nSamples) : Math.round(xScale(xEnd) - xScale(xStart));
    const xs = [...Array(nSamples + 1).keys()].map((x, i) => x*(xEnd - xStart)/nSamples + xStart).filter(x => !isNaN(fx(x)));
    return (
        <LinePath data={xs} x={x => xScale(x)} y={x => yScale(fx(x))} curve={curveLinear} className={classes.line}/>
    );
};