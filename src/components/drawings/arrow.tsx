import React from 'react';

import { Line } from "./line";
import COLORS from "../../colors";

const ARROW_HEAD = "m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z";
const [ARROW_WIDTH, ARROW_HEIGHT] = [12.35, 9.46667];

const sign = x => x >= 0 ? 1 : -1;  // We defign sign(0) = 1 to avoid a collapse when e.g. dx = 0
const toRad = a => (a / 180) * Math.PI;
const toDeg = a => (a * 180) / Math.PI;

const STROKE_DASHARRAY = "4";  // TODO: should be in separate line class?


export const ArrowLine = ({
    xStart, yStart, xEnd, yEnd, margin=0,
    anchorAngleEnd=null, anchorRadiusEnd=0,
    anchorAngleStart=null, anchorRadiusStart=0,
    color="light_gray", lineWidth=2, dashed=false, showArrow=true,
    opacity=1,
}) => {
    const [dx, dy] = [xEnd - xStart, yEnd - yStart];
    const eps = 0.0001;
    
    if (anchorAngleStart === null) {
        anchorAngleStart = toDeg(Math.atan(dy/(dx + eps)));
        anchorAngleStart = dx < 0 ? 180 + anchorAngleStart : anchorAngleStart;
        anchorRadiusStart = 0;
    } else {
        anchorAngleStart = - anchorAngleStart;
    }
    if (anchorAngleEnd === null) {
        anchorAngleEnd = -toDeg(Math.atan(dy/(dx + eps)));
        anchorAngleEnd = dx > 0 ? 180 + anchorAngleEnd : anchorAngleEnd;
        anchorRadiusEnd = 0;
    } else {
        anchorAngleEnd = - anchorAngleEnd;
    }

    let arrowX, arrowY, arrowAngle, arrowScale;

    if (showArrow) {
        arrowAngle = anchorAngleEnd;
        arrowScale = lineWidth / 2.5;
        arrowX = xEnd + margin * Math.cos(toRad(anchorAngleEnd));
        arrowY = yEnd + margin * Math.sin(toRad(anchorAngleEnd));
        xEnd = xEnd + 2/3 * ARROW_WIDTH * arrowScale * Math.cos(toRad(anchorAngleEnd));
        yEnd = yEnd + 2/3 * ARROW_WIDTH * arrowScale * Math.sin(toRad(anchorAngleEnd));
    }
    const ucColor = color.toUpperCase();
    color = ucColor in COLORS ? COLORS[ucColor] : color;
    return (
    <>
        <Line xStart={xStart} yStart={yStart} xEnd={xEnd} yEnd={yEnd} color={color} margin={margin}
            anchorAngleEnd={anchorAngleEnd} anchorRadiusEnd={anchorRadiusEnd}
            anchorAngleStart={anchorAngleStart} anchorRadiusStart={anchorRadiusStart}
            lineWidth={lineWidth} dashed={dashed}
            opacity={opacity} />
        { showArrow ?
            <path fill={color} stroke={color} strokeLinejoin="round" strokeOpacity={opacity} fillOpacity={opacity}
                transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle}) scale(${arrowScale})`} d={ARROW_HEAD} />
            : null }
    </>
    );
};
