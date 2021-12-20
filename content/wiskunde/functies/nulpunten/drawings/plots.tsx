import React from "react";
import { Plot } from "components/shortcodes/plot";
import { Fx } from "components/shortcodes/fx";
import { SvgNote } from  "components/shortcodes/svgNote";
import { AnnotArrow } from  "components/shortcodes/annot";
import { Point } from  "components/shortcodes/point";


export const Nulpunten = () => {
    return (
        <Plot xColor="gray" yColor="gray">
            <Fx fx={x => -Math.pow(x, 2) + 9}/>
            <Point x={3} y={0} color="orange" size={10}/>
            <AnnotArrow target={{x: 3, y: 0}} annot={{x: 6, y: 2}} vAlignAnnot="bottom" hAlignAnnot="center" hAlignTarget="right"/>
            <SvgNote x={6} y={2} vAlign="bottom" hAlign="center">Nulpunt</SvgNote>
            <Point x={-3} y={0} color="orange" size={10}/>
            <AnnotArrow target={{x: -3, y: 0}} annot={{x: -6, y: 2}} vAlignAnnot="bottom"  hAlignAnnot="center" hAlignTarget="left"/>
            <SvgNote x={-6} y={2} vAlign="bottom" hAlign="center">Nulpunt</SvgNote>
        </Plot>
    )
};
