import React from "react";
import { Plot } from "components/shortcodes/plot";
import { DrawingContext } from "components/shortcodes/drawing";
import { Fx } from "components/shortcodes/fx";
import { ArrowLine } from "components/shortcodes/arrow";
import { Annot } from  "components/shortcodes/annot";
import { AnnotArrow } from  "components/shortcodes/annotArrow";
import { Point } from  "components/shortcodes/point";
import { Line } from  "components/shortcodes/line";
import _ from "lodash";


const func = x => 3*Math.sqrt(x + 5) - 6;


export const FuncPlot = () => {
    return (
        <Plot>
            <Fx fx={func} xStart={-5} xEnd={15} />
        </Plot>
    )
};

const FuncDomainChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            {_.range(20).map(i => {
            const x = i - 5 + 0.0001;
            const y = func(x);
            return (
            Math.abs(y) > 1 ?
            <ArrowLine xStart={xScale(x)} yStart={yScale(y)} xEnd={xScale(x)} yEnd={yScale(0)} margin={xScale.metric(.5)} dashed={true} opacity={0.5} key={i} />
            : null
            );
            })}
            <Fx fx={func} xStart={-5} xEnd={15} opacity={0.5} />
            <Line xStart={-5} yStart={0} xEnd={15} yEnd={0} color="green" lineWidth={4} />
            <Point x={-5} y={0} color="green" size={10} />
            <Annot x={xScale(-6)} y={yScale(5)} vAlign="bottom" showBackground>
                { String.raw`$\green{\mathrm{dom}~f = [-5; +\infty[}$` }
            </Annot>
            <AnnotArrow target={{x: xScale(-5), y: yScale(0)}} annot={{x: xScale(-6), y: yScale(5)}} vAlignAnnot="bottom" hAlignTarget="left" />
        </>
    )
};


export const FuncDomain = () => {
    return (
        <Plot>
            <FuncDomainChild />
        </Plot>
    )
};

const FuncRangeChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);
    const fxi = x => Math.pow((x + 6)/3, 2) - 5;
    return (
        <>
            {_.range(20).map(i => {
            const y = i - 6;
            const x = fxi(y);
            return (
            Math.abs(x) > 1 ?
            <ArrowLine xStart={xScale(x)} yStart={yScale(y)} xEnd={xScale(0)} yEnd={yScale(y)} margin={xScale.metric(.5)} dashed={true} opacity={0.5} key={i} />
            : null
            );
            })}
            <Fx fx={func} xStart={-5} xEnd={15} opacity={0.5} />
            <Line xStart={0} yStart={-6} xEnd={0} yEnd={15} color="green" lineWidth={4} />
            <Point x={0} y={-6} color="green" size={10} />
            <Annot x={xScale(2)} y={yScale(-8)} hAlign="center" vAlign="top" showBackground>
                { String.raw`$\green{\mathrm{bld}~f = [-6; +\infty[}$` }
            </Annot>
            <AnnotArrow target={{x: xScale(0), y: yScale(-6)}} annot={{x: xScale(2), y: yScale(-8)}} hAlignTarget="right" vAlignTarget="bottom" hAlignAnnot="center" vAlignAnnot="top" />
        </>
    )
};

export const FuncRange = () => {
    return (
        <Plot>
            <FuncRangeChild />
        </Plot>
    )
};
