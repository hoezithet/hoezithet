import React from "react";
import { Plot } from "components/drawings/plot";
import { DrawingContext } from "components/drawings/drawing";
import { Fx } from "components/drawings/fx";
import { ArrowLine } from "components/drawings/arrow";
import { Annot } from  "components/drawings/annot";
import { AnnotArrow } from  "components/drawings/annotArrow";
import { Point } from  "components/drawings/point";
import { Line } from  "components/drawings/line";
import _ from "lodash";


const func = x => 3*Math.sqrt(x + 5) - 6;


export const DomBldFuncPlot = () => {
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
            <Line xStart={xScale(-5)} yStart={yScale(0)} xEnd={xScale(15)} yEnd={yScale(0)} color="green" lineWidth={4} />
            <Point x={xScale(-5)} y={yScale(0)} color="green" size={10} />
            <Annot x={xScale(-6)} y={yScale(5)} align="bottom center" showBackground>
                { String.raw`$\green{\mathrm{dom}~f = [-5; +\infty[}$` }
            </Annot>
            <AnnotArrow target={{x: xScale(-5), y: yScale(0)}} annot={{x: xScale(-6), y: yScale(5)}} annotAlign="bottom center" targetAlign="top left" />
        </>
    )
};


export const DomBldFuncDomain = () => {
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
            <Line xStart={xScale(0)} yStart={yScale(-6)} xEnd={xScale(0)} yEnd={yScale(15)} color="green" lineWidth={4} />
            <Point x={xScale(0)} y={yScale(-6)} color="green" size={10} />
            <Annot x={xScale(2)} y={yScale(-8)} align="top center" showBackground>
                { String.raw`$\green{\mathrm{bld}~f = [-6; +\infty[}$` }
            </Annot>
            <AnnotArrow target={{x: xScale(0), y: yScale(-6)}} annot={{x: xScale(2), y: yScale(-8)}} targetAlign="bottom right" annotAlign="top center"/>
        </>
    )
};

export const DomBldFuncRange = () => {
    return (
        <Plot>
            <FuncRangeChild />
        </Plot>
    )
};
