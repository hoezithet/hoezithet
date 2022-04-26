import React from "react";
import { Plot } from "components/shortcodes/plot";
import { Fx } from "components/shortcodes/fx";
import { Annot } from  "components/shortcodes/annot";
import { AnnotArrow } from  "components/shortcodes/annotArrow";
import { Point } from  "components/shortcodes/point";
import { HairLines } from  "components/shortcodes/hairlines";
import _ from "lodash";


export const SinglePoint = () => {
    return (
        <Plot xColor="orange" yColor="green">
          <HairLines x={4} y={2}/>
          <AnnotArrow target={{x: 4, y: 2}} annot={{x: 8, y: 4}} vAlignAnnot="bottom" hAlignTarget="right" />
          <Annot x={8} y={4} vAlign="bottom">
            {String.raw`$(\orange{4};~\green{2})$`}
          </Annot>
          <Point x={4} y={2} size={5} />
        </Plot>
    )
};

export const MultiplePoints = () => {
    return (
        <Plot xColor="orange" yColor="green"  yMin={-20}>
          { _.range(11).map(i => {
            const x = i;
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
              <Point x={x} y={y} size={5} key={i}/>
            );
          })}
        </Plot>
    );
};

export const ManyPoints = () => {
    return (
        <Plot xColor="orange" yColor="green" yMin={-20}>
            { _.range(0, 10, 0.1).map(x => {
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
                <Point x={x} y={y} size={5} key={x}/>
            );
            })}
        </Plot>
    );
};

export const ThousandPoints = () => {
    return (
        <Plot xColor="orange" yColor="green" yMin={-20}>
            { _.range(0, 10, 0.01).map(x => {
            const y = -(1/2)*x**2 + 4*x - 6;
            return (
                <Point x={x} y={y} size={5} key={x}/>
            );
            })}
        </Plot>
    );
};

export const NoFunction = () => {
    return (
        <Plot xColor="orange" yColor="green">
            <Fx fx={x => Math.sqrt(-x + 1)} xEnd={1} />
            <Fx fx={x => -Math.sqrt(-x + 1)} xStart={-4} xEnd={1} />
            <AnnotArrow target={{x: -2, y:-Math.sqrt(3)}} annot={{x: -5, y: -4}} vAlignTarget="bottom" vAlignAnnot="top" hAlignAnnot="center" />
            <Annot x={-5} y={-4} hAlign="center" vAlign="top">Geen functie</Annot>
        </Plot>
    );
};
