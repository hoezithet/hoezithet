import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import isEqual from "lodash/isEqual";


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


const getNodeParents = node => (node.parentElement ? getNodeParents(node.parentElement) : []).concat([node]);


const getGlobalToLocalMatrix = (el: Element) => {
    /**
     * Transform a point defined in root SVG coordinates to a point in the
     * local coordate system.
     **/
    const svgRoot = el.closest("svg.drawing");
    let revParents = getNodeParents(el).reverse();

    // Skip MathJax group transforms
    const mjxIdx = revParents.findIndex(node => node.hasAttribute('jax'));
    if (mjxIdx !== -1) {
        revParents = revParents.slice(mjxIdx);
    }

    // Find matrix that undoes all transforms
    const tfmMatrix = revParents.filter(node => node instanceof SVGGElement
        && node.hasAttribute('transform')
    ).reduce((prev, curr) =>
        prev.multiply(curr.getCTM().inverse()),
        svgRoot.createSVGMatrix()
    );
    return tfmMatrix;
}


const getElCoord = (el: Element, hAlign: string, vAlign: string) => {
    const rect = el.getBoundingClientRect()
    const svgRoot = el.closest("svg.drawing");
    const originRect = svgRoot?.getBoundingClientRect();

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

    const point = svgRoot.createSVGPoint();
    point.x = hAlign === "left" ? tLeft : (hAlign === "right" ? tRight : tCenterX);
    point.y = vAlign === "top" ? tTop : (vAlign === "bottom" ? tBottom : tCenterY);

    return point;
}


const convertToCoord = (annotOrTarget: string|Coordinate, hAlign: string, vAlign: string) => {
    if (typeof document === "undefined") {
        return null;
    }
    if (Array.isArray(annotOrTarget)) {
        return new DOMPoint(annotOrTarget[0], annotOrTarget[1]);
    } else if (typeof annotOrTarget === "string") {
        const el = document.querySelector(annotOrTarget);
        if (el !== null) {
            return getElCoord(el, hAlign, vAlign);
        } else {
            return null;
        }
    } else {
        return new DOMPoint(annotOrTarget.x, annotOrTarget.y);
    }
}


export const AnnotArrow = ({
    annot, target,
    margin=5,
    marginAnnot=null, marginTarget=null,
    anchorRadius=20,
    anchorRadiusTarget=null, anchorRadiusAnnot=null,
    annotAlign="top center",
    targetAlign="top center",
    color="light_gray", opacity=1, lineWidth=2,
    hideHead=false, dashed=false,
}: AnnotArrowProps) => {
    const [vAlignAnnot, hAlignAnnot] = annotAlign.split(" ");
    const [vAlignTarget, hAlignTarget] = targetAlign.split(" ");
    const annotArrowRef = React.useRef<SVGGElement|null>(null);

    const anchorAngleAnnot = getAngleFromAlign(hAlignAnnot, vAlignAnnot);
    const anchorAngleTarget = getAngleFromAlign(hAlignTarget, vAlignTarget);

    marginAnnot = marginAnnot === null ? margin : marginAnnot;
    marginTarget = marginTarget === null ? margin : marginTarget;

    if (anchorRadiusTarget === null) {
        anchorRadiusTarget = anchorRadius;
    }
    if (anchorRadiusAnnot === null) {
        anchorRadiusAnnot = anchorRadius;
    }

    const globalAnnotCoord = convertToCoord(annot, hAlignAnnot, vAlignAnnot);
    const formattedTarget = Array.isArray(target) && target.length > 0 && typeof target[0] !== "number" ? target : [target];
    const globalTargetCoords = formattedTarget.map(t => convertToCoord(t, hAlignTarget, vAlignTarget));
    const prevGAnnotRef = React.useRef<SVGPoint|null>(null);
    const prevGTargetRef = React.useRef<SVGPoint[]|null>(null);

    const [annotCoord, setAnnotCoord] = React.useState<SVGPoint>(globalAnnotCoord);
    const [targetCoords, setTargetCoords] = React.useState<SVGPoint[]>(globalTargetCoords);

    const comparePoints = (p1: SVGPoint, p2: SVGPoint, precision=2) => {
        return (
            p1.x.toFixed(precision) === p2.x.toFixed(precision)
            && p1.y.toFixed(precision) === p2.y.toFixed(precision)
        )
    };

    // Returned coordinates are wrt root svg coordinate system, but ArrowLine
    // might have other coordinate system!
    React.useEffect(() => {
        if (
            prevGAnnotRef.current !== null
            && comparePoints(prevGAnnotRef.current, globalAnnotCoord)
            && prevGTargetRef.current !== null
            && prevGTargetRef.current.every((p, i) => comparePoints(p, globalTargetCoords[i]))
        ) {
            return;
        }
        const node = annotArrowRef.current;
        if (node !== null) {
            const tfmMatrix = getGlobalToLocalMatrix(node);
            if (globalAnnotCoord !== null) {
                const localAnnotCoord = globalAnnotCoord.matrixTransform(tfmMatrix);
                setAnnotCoord(localAnnotCoord);
            }
            const newTargetCoords: SVGPoint[] = [];
            globalTargetCoords?.forEach((targetCoord, i) => {
                if (targetCoord !== null) {
                    const localTargetCoord = targetCoord.matrixTransform(tfmMatrix);
                    newTargetCoords.push(localTargetCoord);
                }
            });
            setTargetCoords(newTargetCoords);
        }
        prevGAnnotRef.current = globalAnnotCoord;
        prevGTargetRef.current = globalTargetCoords;
    }, [globalAnnotCoord, globalTargetCoords]);

    return (
        <>
            {
                annotCoord ?
                targetCoords.filter(t => t !== null).map((targetCoord, i) => (
                    <g key={i} ref={annotArrowRef}>
                        <ArrowLine xStart={annotCoord?.x} yStart={annotCoord?.y} xEnd={targetCoord.x} yEnd={targetCoord.y}
                            marginStart={marginAnnot}
                            marginEnd={marginTarget}
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
