import React from "react";
import { Plot } from "components/drawings/plot";
import { DrawingContext } from "components/drawings/drawing";
import { Fx } from "components/drawings/fx";
import { Annot } from  "components/drawings/annot";
import { AnnotArrow } from  "components/drawings/annotArrow";
import { Point } from  "components/drawings/point";
import { HairLines } from  "components/drawings/hairlines";
import _ from "lodash";


const SinglePointChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <HairLines x={xScale(4)} y={yScale(2)} xStart={xScale(0)} yStart={yScale(0)}/>
          <AnnotArrow target={{x: xScale(4), y: yScale(2)}} annot={{x: xScale(8), y: yScale(4)}} annotAlign="bottom center" targetAlign="top right" />
          <Annot x={xScale(8)} y={yScale(4)} vAlign="bottom">
            {String.raw`$(\orange{4};~\green{2})$`}
          </Annot>
          <Point x={xScale(4)} y={yScale(2)} size={5} />
        </>
    )
};

export const SinglePoint = () => {
    return (
        <Plot xColor="orange" yColor="green">
          <SinglePointChild />
        </Plot>
    )
};

const MultiplePointsChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            { _.range(11).map(x => {
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
                <Point x={xScale(x)} y={yScale(y)} size={5} key={x}/>
            );
            })}
        </>
    );
};

export const MultiplePoints = () => {
    return (
        <Plot xColor="orange" yColor="green"  yMin={-20}>
            <MultiplePointsChild/>
        </Plot>
    );
};


const ManyPointsChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            { _.range(0, 10, 0.1).map(x => {
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
                <Point x={xScale(x)} y={yScale(y)} size={5} key={x}/>
            );
            })}
        </>
    );
};

export const ManyPoints = () => {
    return (
        <Plot xColor="orange" yColor="green" yMin={-20}>
            <ManyPointsChild/>
        </Plot>
    );
};


const ThousandPointsChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            { _.range(0, 10, 0.01).map(x => {
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
                <Point x={xScale(x)} y={yScale(y)} size={5} key={x}/>
            );
            })}
        </>
    );
};

export const ThousandPoints = () => {
    return (
        <Plot xColor="orange" yColor="green" yMin={-20}>
            <ThousandPointsChild/>
        </Plot>
    );
};


const NoFunctionChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            <Fx fx={x => Math.sqrt(-x + 1)} xEnd={1} />
            <Fx fx={x => -Math.sqrt(-x + 1)} xStart={-4} xEnd={1} />
            <AnnotArrow target={{x: xScale(-2), y: yScale(-Math.sqrt(3))}} annot={{x: xScale(-5), y: yScale(-4)}} targetAlign="bottom center" annotAlign="top center"/>
            <Annot x={xScale(-5)} y={yScale(-4)} hAlign="center" vAlign="top">Geen functie</Annot>
        </>
    );
};

export const NoFunction = () => {
    return (
        <Plot xColor="orange" yColor="green">
            <NoFunctionChild />
        </Plot>
    );
};
