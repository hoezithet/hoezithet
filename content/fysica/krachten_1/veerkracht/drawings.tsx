import React from "react";

import DrawingGrid from "components/shortcodes/drawingGrid";
import { SaveableDrawing as Drawing } from "components/shortcodes/drawing";
import { Annot } from "components/shortcodes/annot";
import { Line } from "components/shortcodes/line";
import Spring from "components/shortcodes/spring";
import Ruler from "components/shortcodes/ruler";


type LengthOfSpringProps = {
    xSpring: number,
    ySpring: number,
    xAnnot: number,
    yAnnot: number,
    yRuler: number,
    yTarget: number,
    springSize: number,
    rulerSize: number,
    unit: string,
}


export const LengthOfSpring = ({
    xSpring, ySpring, springSize,
    unit = "cm", rulerSize, yRuler, xAnnot, yAnnot, yTarget
}: LengthOfSpringProps) => {
    const xSpringEnd = xSpring + springSize;

    const xRuler = xSpring;

    const xTarget = xSpringEnd;

    return (
      <>
        <Ruler x={xRuler} y={yRuler} size={rulerSize} unit={unit} emphasize={springSize} />
        <Line xStart={xSpring} xEnd={xSpring} yStart={yRuler} yEnd={ySpring} color="light_gray" dashed />
        <Line xStart={xSpringEnd} xEnd={xSpringEnd} yStart={yRuler} yEnd={ySpring} color="light_gray" dashed />
        <Spring x={xSpring} y={ySpring} length={springSize} endsLength={3} numLongLoops={20} loopDiameter={5} />
        <Annot xAnnot={xAnnot} yAnnot={yAnnot} xTarget={xTarget} yTarget={yTarget} anchorAngleAnnot={30} anchorAngleTarget={45} >
            {String.raw`De lengte van deze veer is $l = ${springSize}~\si{${unit}}$`}
        </Annot>
      </>
    );
};
