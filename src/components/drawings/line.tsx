import React, { createContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Drawing, DrawingContext } from "./drawing";
import { getColor } from "../../colors";

export const STROKE_DASHARRAY = "4";
const toRad = a => (a / 180) * Math.PI;


export const useStyles = makeStyles({
    line: {
        fill: "none",
        stroke: props => props.color, 
        strokeWidth: props => props.lineWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeOpacity: props => props.opacity,
        shapeRendering: "geometricPrecision",
    }
});

export const Line = ({
    xStart, yStart, xEnd, yEnd, color="blue", margin=0,
    anchorAngleEnd=null, anchorRadiusEnd=0,
    anchorAngleStart=null, anchorRadiusStart=0,
    lineWidth=3, dashed=false,
    opacity=1
}) => {
    const classes = useStyles({color: getColor(color), lineWidth: lineWidth});

    anchorAngleStart = toRad(anchorAngleStart);
    anchorAngleEnd = toRad(anchorAngleEnd);
    
    let [xEndLine, yEndLine, xStartLine, yStartLine] = [
        xEnd + margin * Math.cos(anchorAngleEnd),
        yEnd + margin * Math.sin(anchorAngleEnd),
        xStart + margin * Math.cos(anchorAngleStart),
        yStart + margin * Math.sin(anchorAngleStart),
    ];
    let [xEndAnch, yEndAnch, xStartAnch, yStartAnch] = [
        xEndLine + anchorRadiusEnd * Math.cos(anchorAngleEnd),
        yEndLine + anchorRadiusEnd * Math.sin(anchorAngleEnd),
        xStartLine + anchorRadiusStart * Math.cos(anchorAngleStart),
        yStartLine + anchorRadiusStart * Math.sin(anchorAngleStart),
    ];
    
    return (
        <path d={`M ${xEndLine} ${yEndLine} C ${xEndAnch} ${yEndAnch}, ${xStartAnch} ${yStartAnch}, ${xStartLine} ${yStartLine}`}
            stroke={getColor(color)} fill="#00000000" strokeDasharray={dashed ? STROKE_DASHARRAY : "none"}
            strokeLinecap="round" strokeWidth={lineWidth} strokeOpacity={opacity} />
    );
};
