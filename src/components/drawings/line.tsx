import React, { createContext, useEffect, useRef, useState } from 'react';
import styled from "styled-components";

import { Drawing, DrawingContext } from "./drawing";
import { getColor } from "../../colors";

export const STROKE_DASHARRAY = "4";
const toRad = a => (a / 180) * Math.PI;


export const StyledPath = styled.path`
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    shape-rendering: geometricPrecision;
`;

export const Line = ({
    xStart, yStart, xEnd, yEnd, color="blue", margin=0,
    anchorAngleEnd=null, anchorRadiusEnd=0,
    anchorAngleStart=null, anchorRadiusStart=0,
    lineWidth=3, dashed=false,
    opacity=1
}) => {
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
        <StyledPath d={`M ${xEndLine} ${yEndLine} C ${xEndAnch} ${yEndAnch}, ${xStartAnch} ${yStartAnch}, ${xStartLine} ${yStartLine}`}
            stroke={getColor(color)} strokeDasharray={dashed ? STROKE_DASHARRAY : "none"}
            strokeWidth={lineWidth} strokeOpacity={opacity} />
    );
};
