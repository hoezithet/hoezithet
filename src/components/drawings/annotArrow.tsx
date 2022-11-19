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


const getGlobalToLocalMatrix = (el: Element): DOMMatrix => {
    /**
     * Transform a point defined in root SVG coordinates to a point in the
     * local coordate system.
     **/
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
        new DOMMatrix()
    );
    return tfmMatrix;
}


const getElCoord = (el: Element, svgRoot: SVGElement, hAlign: string, vAlign: string) => {
    const rect = el.getBoundingClientRect()
    const originRect = svgRoot.getBoundingClientRect();

    const [tLeft, tTop, tRight, tBottom] = [
        rect?.left,
        rect?.top,
        rect?.right,
        rect?.bottom,
    ];
    const [tCenterX, tCenterY] = [
        tLeft + rect?.width/2,
        tTop + rect?.height/2,
    ];

    const x = hAlign === "left" ? tLeft : (hAlign === "right" ? tRight : tCenterX);
    const y = vAlign === "top" ? tTop : (vAlign === "bottom" ? tBottom : tCenterY);

    const elPoint = new DOMPoint(x, y);

    const tfmMatrix = getGlobalToLocalMatrix(svgRoot);
    tfmMatrix.translateSelf(-originRect.x, -originRect.y);

    return  elPoint.matrixTransform(tfmMatrix);
}


const convertToCoord = (annotOrTarget: string|Coordinate, svgRoot: SVGElement, hAlign: string, vAlign: string) => {
    if (typeof document === "undefined") {
        return null;
    }
    if (Array.isArray(annotOrTarget) && annotOrTarget.length === 2 && typeof annotOrTarget[0] === "number" && typeof  annotOrTarget[1] === "number") {
        return new DOMPoint(annotOrTarget[0], annotOrTarget[1]);
    } else if (typeof annotOrTarget === "string") {
        const el = document.querySelector(annotOrTarget);
        if (el !== null) {
            return getElCoord(el, svgRoot, hAlign, vAlign);
        } else {
            return null;
        }
    } else if ('x' in annotOrTarget && 'y' in annotOrTarget && typeof annotOrTarget.x === "number" && typeof annotOrTarget.y === "number") {
        return new DOMPoint(annotOrTarget.x, annotOrTarget.y);
    } else {
        return null;
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

    target = Array.isArray(target) && target.length > 0 && typeof target[0] !== "number" ? target : [target];

    const annotArrowsRef = React.useRef(target.map(t => null));
    const svgRef = React.useRef<SVGSVGElement|null>(null);

    const [annotCoord, setAnnotCoord] = React.useState<SVGPoint|null>(null);
    const [targetCoords, setTargetCoords] = React.useState<SVGPoint[]>([]);

    let newAnnotCoord: DOMPoint|null = null;
    let newTargetCoords: DOMPoint[] = target.map(t => null);
    if (svgRef.current !== null) {
        const svgNode = svgRef.current;
        newAnnotCoord = convertToCoord(annot, svgNode, hAlignAnnot, vAlignAnnot);
        newTargetCoords = target.map(t => 
            convertToCoord(t, svgNode, hAlignTarget, vAlignTarget)
        );
    }

    React.useEffect(() => {
        setAnnotCoord(newAnnotCoord);
        setTargetCoords(newTargetCoords);
    }, [
        newAnnotCoord?.x, newAnnotCoord?.y,
        ...newTargetCoords.map(t => t?.x),
        ...newTargetCoords.map(t => t?.y),
    ]);

    return (
        <svg ref={svgRef} style={{overflow: "visible", position: "absolute"}}>
            {
                target.map((t, i) => (
                    <g key={i} ref={node => { annotArrowsRef.current[i] = node }}>
                       {
                          targetCoords[i] !== null && annotCoord !== null ?
                            <ArrowLine xStart={annotCoord.x} yStart={annotCoord.y} xEnd={targetCoords[i].x} yEnd={targetCoords[i].y}
                              marginStart={marginAnnot}
                              marginEnd={marginTarget}
                              anchorAngleStart={anchorAngleAnnot} anchorRadiusStart={anchorRadiusAnnot}
                              anchorAngleEnd={anchorAngleTarget} anchorRadiusEnd={anchorRadiusTarget}
                              color={color} lineWidth={lineWidth} dashed={dashed} showArrow={!hideHead}
                              opacity={opacity} />
                          : null
                       }
                    </g>
                ))
            }
        </svg>
    );
};

export const useAnnotArrow = (props: AnnotArrowProps) => {
    const [arrow, setArrow] = React.useState(null);

    React.useEffect(() => {
        setArrow(
            <AnnotArrow {...props} />
        );
    }, [...Object.values(props)]);

    return arrow;
};
