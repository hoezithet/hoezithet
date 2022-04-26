import React from "react";
import { Plot } from "components/shortcodes/plot";
import { Fx } from "components/shortcodes/fx";
import { Annot } from  "components/shortcodes/annot";
import { AnnotArrow } from  "components/shortcodes/annotArrow";
import { Point } from  "components/shortcodes/point";


export const FuncPlot = () => {
    return (
        <Plot>
            <Fx fx={x => -x + 4} color="green" xEnd={15} />
            <Fx fx={x => 2*x - 3} color="blue" />
            <Point x={7/3} y={5/3} size={10} color="orange" />
            <AnnotArrow target={{x: 7/3, y: 5/3}} annot={{x: 6, y: 3}} hAlignTarget="right" vAlignTarget="center" vAlignAnnot="bottom" />
            <Annot x={6} y={3} vAlign="bottom">Snijpunt</Annot>
        </Plot>
    )
};

export const Nulpunt = () => {
    return (
        <Plot>
            <Fx fx={x => -x + 4} color="green" xEnd={15} />
            <Point x={4} y={0} size={10} color="orange" />
            <AnnotArrow target={{x: 4, y: 0}} annot={{x: 6, y: 3}} hAlignTarget="right" vAlignTarget="top" vAlignAnnot="bottom" />
            <Annot x={6} y={3} vAlign="bottom">{String.raw`Nulpunt $(\orange{4}, 0)$`}</Annot>
        </Plot>
    );
};