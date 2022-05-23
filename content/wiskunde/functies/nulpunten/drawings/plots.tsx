import React from "react";
import { Plot } from "components/drawings/plot";
import { DrawingContext } from "components/drawings/drawing";
import { Fx } from "components/drawings/fx";
import { Annot } from  "components/drawings/annot";
import { AnnotArrow } from  "components/drawings/annotArrow";
import { Point } from  "components/drawings/point";


export const NulpuntenChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            <Fx fx={x => -Math.pow(x, 2) + 9}/>
            <Point x={xScale(3)} y={yScale(0)} color="orange" size={10}/>
            <AnnotArrow target={{x: xScale(3), y: yScale(0)}} annot={{x: xScale(6), y: yScale(2)}} annotAlign="bottom center" targetAlign="top right"/>
            <Annot x={xScale(6)} y={yScale(2)} align="bottom center">Nulpunt</Annot>
            <Point x={xScale(-3)} y={yScale(0)} color="orange" size={10}/>
            <AnnotArrow target={{x: xScale(-3), y: yScale(0)}} annot={{x: xScale(-6), y: yScale(2)}} annotAlign="bottom center" targetAlign="top left"/>
            <Annot x={xScale(-6)} y={yScale(2)} align="bottom center">Nulpunt</Annot>
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
