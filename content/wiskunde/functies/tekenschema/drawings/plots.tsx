import React from "react";
import { Plot } from "components/drawings/plot";
import { DrawingContext } from "components/drawings/drawing";
import { Fx } from "components/drawings/fx";
import { Annot } from "components/drawings/annot";
import { getColor } from "colors";
import { STROKE_DASHARRAY } from "components/drawings/line";


const Rectangle = ({x1, y1, x2, y2, fill=null, stroke=null, dashed=false, strokeOpacity=1, fillOpacity=1}) => {
    fill = fill ? getColor(fill) : "none";
    stroke = stroke ? getColor(stroke) : "none";
    
    return (
        <path d={`M ${x1} ${y1} H ${x2} V ${y2} H ${x1} Z`}
        fill={fill} stroke={stroke} strokeDasharray={dashed ? STROKE_DASHARRAY : "none"}
        strokeOpacity={strokeOpacity} fillOpacity={fillOpacity} />
    );
};

const TekenschemaPlotChild = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
            <Fx fx={x => - Math.pow(x, 2) + 9} />
            <Rectangle x1={xScale(-15)} x2={xScale(-3)} y1={yScale(0)} y2={yScale(-15)} fill="red" fillOpacity={0.5} />
            <Rectangle x1={xScale(-3)} x2={xScale(3)} y1={yScale(0)} y2={yScale(15)} fill="green" fillOpacity={0.5} />
            <Rectangle x1={xScale(3)} x2={xScale(15)} y1={yScale(0)} y2={yScale(-15)} fill="red" fillOpacity={0.5} />
            <Annot x={xScale(-8)} y={yScale(-2)} backgroundOpacity={0.5} showBackground>
                { String.raw`$f(x)\lt 0$` }
            </Annot>
            <Annot x={xScale(0)} y={yScale(2)} backgroundOpacity={0.5} showBackground>
                { String.raw`$f(x)\gt 0$` }
            </Annot>
            <Annot x={xScale(8)} y={yScale(-2)} backgroundOpacity={0.5} showBackground>
                { String.raw`$f(x)\lt 0$` }
            </Annot>
        </>
    );
};


export const TekenschemaPlot = () => {
    return (
        <Plot>
            <TekenschemaPlotChild />
        </Plot>
    );
};
