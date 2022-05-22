import React from "react";
import { Plot } from "components/drawings/plot";
import { Fx } from "components/drawings/fx";
import { DrawingContext } from "components/drawings/drawing";
import { Annot } from  "components/drawings/annot";
import { AnnotArrow } from  "components/drawings/annotArrow";
import { Point } from  "components/drawings/point";


const FuncPlotChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);
    return (
        <>
            <Fx fx={x => -x + 4} color="green" xEnd={15} />
            <Fx fx={x => 2*x - 3} color="blue" />
            <Point x={xScale(7/3)} y={yScale(5/3)} size={10} color="orange" />
            <AnnotArrow target={{x: 7/3, y: 5/3}} annot={{x: 6, y: 3}} hAlignTarget="right" vAlignTarget="center" vAlignAnnot="bottom" />
            <Annot x={xScale(6)} y={yScale(3)} vAlign="bottom">Snijpunt</Annot>
        </>
    )
};

export const FuncPlot = () => {
    return (
        <Plot>
            <FuncPlotChild />
        </Plot>
    )
};

const NulpuntChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);
    return (
        <>
            <Fx fx={x => -x + 4} color="green" xEnd={15} />
            <Point x={xScale(4)} y={yScale(0)} size={10} color="orange" />
            <AnnotArrow target={{x: xScale(4), y: yScale(0)}} annot={{x: xScale(6), y: yScale(3)}} hAlignTarget="right" vAlignTarget="top" vAlignAnnot="bottom" />
            <Annot x={xScale(6)} y={yScale(3)} vAlign="bottom">{String.raw`Nulpunt $(\orange{4}, 0)$`}</Annot>
        </>
    );
};

export const Nulpunt = () => {
    return (
        <Plot>
            <NulpuntChild/>
        </Plot>
    );
};
