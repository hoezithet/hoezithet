import React from "react";
import { Plot } from "components/shortcodes/plot";
import { DrawingContext } from "components/shortcodes/drawing";
import { Fx } from "components/shortcodes/fx";
import { Annot } from  "components/shortcodes/annot";
import { AnnotArrow } from  "components/shortcodes/annotArrow";
import { Point } from  "components/shortcodes/point";


export const NulpuntenChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            <Fx fx={x => -Math.pow(x, 2) + 9}/>
            <Point x={xScale(3)} y={yScale(0)} color="orange" size={10}/>
            <AnnotArrow target={{x: xScale(3), y: yScale(0)}} annot={{x: xScale(6), y: yScale(2)}} vAlignAnnot="bottom" hAlignAnnot="center" hAlignTarget="right"/>
            <Annot x={xScale(6)} y={yScale(2)} vAlign="bottom" hAlign="center">Nulpunt</Annot>
            <Point x={xScale(-3)} y={yScale(0)} color="orange" size={10}/>
            <AnnotArrow target={{x: xScale(-3), y: yScale(0)}} annot={{x: xScale(-6), y: yScale(2)}} vAlignAnnot="bottom"  hAlignAnnot="center" hAlignTarget="left"/>
            <Annot x={xScale(-6)} y={yScale(2)} vAlign="bottom" hAlign="center">Nulpunt</Annot>
        </>
    )
};


export const Nulpunten = () => {
    return (
        <Plot xColor="gray" yColor="gray">
            <NulpuntenChild />
        </Plot>
    )
};
