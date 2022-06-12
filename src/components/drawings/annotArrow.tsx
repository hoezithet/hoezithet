import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import { useStyles } from "./line";


type Coordinate = {
    x: number,
    y: number,
}|number[]

export type AnnotArrowProps = {
    annot: string|Coordinate,
    target: string|Coordinate|Coordinate[],
    margin?: number,
    anchorRadius?: number,
    anchorRadiusTarget?: number|null,
    anchorRadiusAnnot?: number|null,
    annotAlign?: string,
    targetAlign?: string,
    color?: string,
    opacity?: number,
    lineWidth?: number,
    hideHead?: boolean,
    dashed?: boolean,
}


const calcAnchorAngleAnnot = (dx, dy) => {
    if (Math.abs(dx) >= Math.abs(dy)) {
        // If moved more horizontally than vertically, put line on left/right
        return dx >= 0 ? 0 : 180;
    } else {
        // Else, put line on top/bottom
        return dy >= 0 ? -90 : 90;
    }
};


const calcAnchorAngleTarget = (dx, dy) => {
    if (dx >= 0 && dy >=0) {
        // Target is on bottom right of annot
        return 135;
    } else if (dx >= 0 && dy < 0) {
        // Target is on top right of annot
        return -135;
    } else if (dx < 0 && dy >= 0) {
        // Target is on bottom left of annot
        return 45;
    } else {
        // Target is on top left of annot
        return -45;
    }
};


const canonicalAngle = (angle) => {
    // Return equivalent angle between ]-180; 180]
    const posAngle = ((angle % 360) + 360) % 360;
    return (posAngle > 180 ?
        posAngle - 360
        : posAngle
    )
}


const getAngleFromAlign = (hAlign, vAlign) => {
    if (vAlign === "center" && hAlign === "right") {
        return 0;
    } else if (vAlign === "top" && hAlign === "right") {
        return 45;
    } else if (vAlign === "top" && hAlign === "center") {
        return 90;
    } else if (vAlign === "top" && hAlign === "left") {
        return 135;
    } else if (vAlign === "center" && hAlign === "left") {
        return 180;
    } else if (vAlign === "bottom" && hAlign === "left") {
        return -135;
    } else if (vAlign === "bottom" && hAlign === "center") {
        return -90;
    } else if (vAlign === "bottom" && hAlign === "right") {
        return -45;
    }
}


const getElCoord = (el: Element, hAlign: string, vAlign: string) => {
    const rect = el.getBoundingClientRect()
    const originRect = el.closest("svg.drawing")?.getBoundingClientRect();
    const [tLeft, tTop, tRight, tBottom] = [
        rect?.left - (originRect?.x || 0),
        rect?.top - (originRect?.y || 0),
        rect?.right - (originRect?.x || 0),
        rect?.bottom - (originRect?.y || 0),
    ];
    const [tCenterX, tCenterY] = [
        tLeft + rect?.width/2,
        tTop + rect?.height/2,
    ];
    return {
        x: hAlign === "left" ? tLeft : (hAlign === "right" ? tRight : tCenterX),
        y: vAlign === "top" ? tTop : (vAlign === "bottom" ? tBottom : tCenterY),
    }
}


const convertToCoord = (annotOrTarget: string|Coordinate, hAlign: string, vAlign: string) => {
    if (typeof document === "undefined") {
        return null;
    }
    if (Array.isArray(annotOrTarget)) {
        annotOrTarget = {
            x: annotOrTarget[0],
            y: annotOrTarget[1],
        };
    }
    if (typeof annotOrTarget === "string") {
        const el = document.querySelector(annotOrTarget);
        if (el !== null) {
            return getElCoord(el, hAlign, vAlign);
        } else {
            return null;
        }
    } else {
        return annotOrTarget;
    }
}


export const AnnotArrow = ({
    annot, target,
    margin=5,
    anchorRadius=20,
    anchorRadiusTarget=null, anchorRadiusAnnot=null,
    annotAlign="top center",
    targetAlign="top center",
    color="light_gray", opacity=1, lineWidth=2,
    hideHead=false, dashed=false,
}: AnnotArrowProps) => {
    let [annotCoord, setAnnotCoord] = React.useState(null);
    let [targetCoords, setTargetCoords] = React.useState(null);
    const [vAlignAnnot, hAlignAnnot] = annotAlign.split(" ");
    const [vAlignTarget, hAlignTarget] = targetAlign.split(" ");

    const anchorAngleAnnot = getAngleFromAlign(hAlignAnnot, vAlignAnnot);
    const anchorAngleTarget = getAngleFromAlign(hAlignTarget, vAlignTarget);

    annotCoord = convertToCoord(annot, hAlignAnnot, vAlignAnnot);
    const formattedTarget = Array.isArray(target) && target.length > 0 && typeof target[0] !== "number" ? target : [target];
    targetCoords = formattedTarget.map(t => convertToCoord(t, hAlignTarget, vAlignTarget));

    if (anchorRadiusTarget === null) {
        anchorRadiusTarget = anchorRadius;
    }
    if (anchorRadiusAnnot === null) {
        anchorRadiusAnnot = anchorRadius;
    }

    return (
        <>
            {
                annotCoord ?
                targetCoords.filter(t => t !== null).map((targetCoord, i) => (
                    <g key={i}>
                        <ArrowLine xStart={annotCoord.x} yStart={annotCoord.y} xEnd={targetCoord.x} yEnd={targetCoord.y}
                            margin={margin}
                            anchorAngleStart={anchorAngleAnnot} anchorRadiusStart={anchorRadiusAnnot}
                            anchorAngleEnd={anchorAngleTarget} anchorRadiusEnd={anchorRadiusTarget}
                            color={color} lineWidth={lineWidth} dashed={dashed} showArrow={!hideHead}
                            opacity={opacity} />
                    </g>
                ))
                : null
            }
        </>
    );
};
