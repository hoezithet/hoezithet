import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _uniqueId from "lodash/uniqueId";
import { AnnotArrow } from "components/shortcodes/annot";
import { TextAccolade } from "./watIs1m84";
import CowHead from "./cowHead";

const cos30 = Math.sqrt(3)/2;
const sin30 = 1/2;

const isoTopTfm = `rotate(30) skewX(-30) scale(1,${cos30})`;
const isoLeftTfm = `skewY(30) scale(${cos30},1)`;
const isoRightTfm = `skewY(-30) scale(${cos30},1)`;


const MilkCarton = ({x, y, width, height, depth}) => {
    return (
        <g transform={`translate(${x} ${y-height})`} >
           <g transform={`translate(${-width*cos30},${-width*sin30}) ${isoLeftTfm}`}>
               <rect width={width} height={height} fill={getColor("near_white")} stroke={getColor("black")} strokeLinejoin="round" />
               <CowHead x={width/2} y={height/3} hAlign="center" vAlign="center" width={width/2} height={height/2} ignoreDrawingContext />
               <SvgNote x={width/2} y={height} hAlign="center" vAlign="bottom" fontSize={`${height/3}px`} useContextScale={false}>
                   {String.raw`**1L**`}
               </SvgNote>
           </g>
           <g transform={`translate(${-depth*cos30},${-(width+depth)*sin30}) ${isoTopTfm}`} fill={getColor("near_white")} stroke={getColor("black")} strokeLinejoin="round" >
               <rect width={width} height={depth} />
           </g>
           <g transform={isoRightTfm} fill={getColor("near_white")} stroke={getColor("black")} strokeLinejoin="round" >
               <rect width={depth} height={height} />
               <path d={`M 0,0 h ${depth} L ${depth/2},${depth/2} z`} />
           </g>
        </g>
    );
};

const Cube = ({x, y, size, strokeWidth=5, accWidth=null, fontSize=null, text=null, xShift=0, color="blue"}) => {
    const Square = ({size, color}) => {
        return <rect height={size} width={size} rx={size/20} fill={getColor(color)} stroke={getColor("near_white")} strokeWidth={strokeWidth} paintOrder="stroke" strokeLinejoin="round"/>;
    };
    return (
       <g transform={`translate(${x+xShift*cos30},${y-size+xShift*sin30})`}>
           <g transform={`translate(0,${-size}) ${isoTopTfm}`}>
               <Square size={size} color={color} />
           </g>
           <g transform={`translate(${-size*cos30},${-size*sin30}) ${isoLeftTfm}`}>
               <Square size={size} color={color} />
               { text !== null ? (
                   <TextAccolade x1={-fontSize} x2={0} y={size}
                      color={getColor("gray")}
                      height={size} width={accWidth}
                      fontSize={fontSize} strokeWidth={strokeWidth}>
                      {text}
                   </TextAccolade>
                 ) : null }
           </g>
           <g transform={isoRightTfm}>
               <Square size={size} color={color} />
           </g>
       </g>
    );
}


const _DrieKubussen = () => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const [cube1X, cube1Y, cube1Size, cube1Text] = [xScale(2), yScale(0), xScale.metric(1), String.raw`$1~\si{m}$`];
    const [cube2X, cube2Y, cube2Size, cube2Text] = [cube1X, yScale(3), xScale.metric(0.1), String.raw`$1~\si{dm}$`];
    const [cube3X, cube3Y, cube3Size, cube3Text] = [cube2X, yScale(4), xScale.metric(0.01), String.raw`$1~\si{cm}$`];
    const cubeStrokeWidth = xScale.metric(0.01);
    const fontSize = yScale.metric(0.2);
    const accWidth = xScale.metric(0.1);

    return (
        <>
            <Cube x={cube1X} y={cube1Y} text={cube1Text} size={cube1Size} strokeWidth={cubeStrokeWidth} accWidth={accWidth} fontSize={fontSize} />
            <Cube x={cube2X} y={cube2Y} text={cube2Text} size={cube2Size} color="green" strokeWidth={cubeStrokeWidth} accWidth={accWidth} fontSize={fontSize} />
            <Cube x={cube3X} y={cube3Y} text={cube3Text} size={cube3Size} color="orange" strokeWidth={cubeStrokeWidth} accWidth={accWidth} fontSize={fontSize} />
        </>
    );
};

export const DrieKubussen = () => {
    const width = 4;
    const ar = 4/5;
    return (
        <Drawing xMin={0} xMax={width} yMin={0} yMax={width/ar}>
            {/** <DrawingGrid majorX={0.5} majorY={0.5} /> **/}
            <_DrieKubussen />
        </Drawing>
    );
};


const _DrieKubussenMetVolume = () => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const [cube1X, cube1Y, cube1Size] = [xScale(1.5), yScale(0), xScale.metric(1)];
    const [cube2X, cube2Y, cube2Size] = [cube1X, yScale(3), xScale.metric(0.1)];
    const [cube3X, cube3Y, cube3Size] = [cube2X, yScale(4), xScale.metric(0.01)];
    const cubeStrokeWidth = xScale.metric(0.01);

    const [note1X, note1Y] = [xScale(3), cube1Y - (0.5 + sin30)*cube1Size];
    const [note2X, note2Y] = [note1X, cube2Y - (0.5 + sin30)*cube2Size];
    const [note3X, note3Y] = [note2X, cube3Y - (0.5 + sin30)*cube3Size];
    const fontSize = yScale.metric(0.2);

    return (
        <>
            <Cube x={cube1X} y={cube1Y} size={cube1Size} strokeWidth={cubeStrokeWidth} />
            <Cube x={cube2X} y={cube2Y} size={cube2Size} color="green" strokeWidth={cubeStrokeWidth} />
            <Cube x={cube3X} y={cube3Y} size={cube3Size} color="orange" strokeWidth={cubeStrokeWidth} />
            <SvgNote x={note1X} y={note1Y} hAlign="left" fontSize={fontSize} useContextScale={false}>
                {String.raw`$1~\si{m}^3$`}
            </SvgNote>
            <SvgNote x={note2X} y={note2Y} hAlign="left" fontSize={fontSize} useContextScale={false}>
                {String.raw`$1~\si{dm}^3$`}
            </SvgNote>
            <SvgNote x={note3X} y={note3Y} hAlign="left" fontSize={fontSize} useContextScale={false}>
                {String.raw`$1~\si{cm}^3$`}
            </SvgNote>
            <AnnotArrow annot={[note1X, note1Y]} target={[cube1X + cube1Size*cos30, cube1Y - cube1Size*(1 + sin30)]} ignoreContext hAlignAnnot="left" vAlignAnnot="center" hAlignTarget="right" vAlignTarget="top" />
            <AnnotArrow annot={[note2X, note2Y]} target={[cube2X + cube2Size*cos30, cube2Y - cube2Size*(1 + sin30)]} ignoreContext hAlignAnnot="left" vAlignAnnot="center" hAlignTarget="right" vAlignTarget="top" />
            <AnnotArrow annot={[note3X, note3Y]} target={[cube3X + cube3Size*cos30, cube3Y - cube3Size*(1 + sin30)]} ignoreContext hAlignAnnot="left" vAlignAnnot="center" hAlignTarget="right" vAlignTarget="top" />
        </>
    );
};


export const DrieKubussenMetVolume = () => {
    const width = 4;
    const ar = 4/5;
    return (
        <Drawing xMin={0} xMax={width} yMin={0} yMax={width/ar}>
            {/** <DrawingGrid majorX={0.5} majorY={0.5} /> **/}
            <_DrieKubussenMetVolume />
        </Drawing>
    );
};


const _DrieKubussenMetMelk = () => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const [cube1X, cube1Y, cube1Size] = [xScale(1.5), yScale(0), xScale.metric(1)];
    const [cube2X, cube2Y, cube2Size] = [cube1X, yScale(3), xScale.metric(0.1)];
    const [cube3X, cube3Y, cube3Size] = [cube2X, yScale(4), xScale.metric(0.01)];
    const cubeStrokeWidth = xScale.metric(0.01);

    const fontSize = yScale.metric(0.2);
    const [note1X, note1Y] = [cube1X + cube1Size * cos30 + 2.3*fontSize, cube1Y - (0.5 + sin30)*cube1Size];
    const [note2X, note2Y] = [cube2X + cube2Size * cos30 + 2.3*fontSize, cube2Y - (0.5 + sin30)*cube2Size];
    const [note3X, note3Y] = [cube3X + cube3Size * cos30 + 2.3*fontSize, cube3Y - (0.5 + sin30)*cube3Size];

    const [cartonWidth, cartonHeight, cartonDepth] = [xScale.metric(0.1), yScale.metric(0.2), xScale.metric(0.05)];
    const [carton1X, carton1Y] = [note1X + cartonWidth, note1Y + cartonHeight/2 + cartonWidth*sin30];
    const [carton2X, carton2Y] = [note2X + cartonWidth, note2Y + cartonHeight/2 + cartonWidth*sin30];
    const [carton3X, carton3Y] = [note3X + cartonWidth, note3Y + cartonHeight/2 + cartonWidth*sin30];

    return (
        <>
            <Cube x={cube1X} y={cube1Y} size={cube1Size} strokeWidth={cubeStrokeWidth} />
            <Cube x={cube2X} y={cube2Y} size={cube2Size} color="green" strokeWidth={cubeStrokeWidth} />
            <Cube x={cube3X} y={cube3Y} size={cube3Size} color="orange" strokeWidth={cubeStrokeWidth} />
            <MilkCarton x={carton1X} y={carton1Y} width={cartonWidth} height={cartonHeight} depth={cartonDepth} />
            <MilkCarton x={carton2X} y={carton2Y} width={cartonWidth} height={cartonHeight} depth={cartonDepth} />
            <MilkCarton x={carton3X} y={carton3Y} width={cartonWidth} height={cartonHeight} depth={cartonDepth} />
            <SvgNote x={note1X} y={note1Y} hAlign="right" fontSize={fontSize} useContextScale={false}>
                {String.raw`$~\neq~$`}
            </SvgNote>
            <SvgNote x={note2X} y={note2Y} hAlign="right" fontSize={fontSize} useContextScale={false}>
                {String.raw`$~\approx~$`}
            </SvgNote>
            <SvgNote x={note3X} y={note3Y} hAlign="right" fontSize={fontSize} useContextScale={false}>
                {String.raw`$~\neq~$`}
            </SvgNote>
        </>
    );
};


export const DrieKubussenMetMelk = () => {
    const width = 4;
    const ar = 4/5;
    return (
        <Drawing xMin={0} xMax={width} yMin={0} yMax={width/ar}>
            {/** <DrawingGrid majorX={0.5} majorY={0.5} /> **/}
            <_DrieKubussenMetMelk />
        </Drawing>
    );
};


const _Dm3IsMelk = () => {
    const { xScale, yScale } = React.useContext(DrawingContext);

    const [cube2X, cube2Y, cube2Size] = [xScale(0.55), yScale(0.5), xScale.metric(0.1)];
    const cubeStrokeWidth = xScale.metric(0.01);

    const [note1dm3X, note1dm3Y] = [xScale(0.75), cube2Y + 1.5*cube2Size];

    const fontSize = yScale.metric(0.1);
    const [note2X, note2Y] = [xScale(0.75), cube2Y - (0.5 + sin30)*cube2Size];

    const [cartonWidth, cartonHeight, cartonDepth] = [xScale.metric(0.1), yScale.metric(0.2), xScale.metric(0.05)];
    const [carton2X, carton2Y] = [xScale(1.0), note2Y + cartonHeight/2 + cartonWidth*sin30];

    return (
        <>
            <Cube x={cube2X} y={cube2Y} size={cube2Size} color="green" strokeWidth={cubeStrokeWidth} />
            <SvgNote x={note1dm3X} y={note1dm3Y} hAlign="center" vAlign="top" fontSize={fontSize} useContextScale={false}>
                {String.raw`$1~\si{dm}^3 = 1~\si{l}$`}
            </SvgNote>
            <MilkCarton x={carton2X} y={carton2Y} width={cartonWidth} height={cartonHeight} depth={cartonDepth} />
        </>
    );
};


export const Dm3IsMelk = () => {
    const [xMin, xMax] = [0, 1.5];
    const yMin = 0;
    const ar = 3/2;
    return (
        <Drawing xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMin + (xMax - xMin)/ar}>
            {/** <DrawingGrid majorX={0.5} majorY={0.5} /> **/}
            <_Dm3IsMelk />
        </Drawing>
    );
};
