import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
    const getCoord = x => `${xScale(x)} ${yScale(fx(x))}`;
    return (
        <path d={`M${xs.map(x => getCoord(x)).join(' L ')}`} className={classes.line}/>
    );
};
