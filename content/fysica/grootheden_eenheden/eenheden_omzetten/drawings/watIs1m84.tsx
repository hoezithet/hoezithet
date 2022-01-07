import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Dirk from "./dirk";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _ from "lodash";


const Maatstaf = ({x, y, height, width, color="blue", strokeColor="gray"}) => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const heightPx = yScale.metric(height);
    const widthPx = xScale.metric(width);
    const xPx = xScale(x) - widthPx/2;
    const yPx = yScale(y);

    color = getColor(color);

    const numTicks = Math.floor(height);
    const tickShift = heightPx / numTicks;
    const tickValues = _.range(numTicks).map(i => i + 1);

    color = getColor(color);

    const rects = tickValues.map(i => (
        <g key={i} transform={`translate(${xPx},${yPx - i*tickShift})`}>
            <rect height={tickShift} width={widthPx}
                fill={getColor("near_white")} stroke={color} strokeWidth={2} strokeLinejoin="round" />
            <g transform={`translate(${widthPx/2},${tickShift/2}) rotate(-90)`}>
                <SvgNote x={0} y={0} hAlign="center" vAlign="center"
                    useContextScale={false} fontSize={`${widthPx*2/3}px`}
                    color={color}>
                    {String.raw`$1~\si{m}$`}
                </SvgNote>
            </g>
        </g>
    ));

    return (
        <g>
            { rects }
        </g>
    );
}

const TextAccolade = ({x=0, y=0, width, height, angle=0, textAngle=90, strokeWidth="2", color="gray", children}) => {
    color = getColor(color);

    return (
        <g transform={`translate(${x},${y})`}>
            <g transform={`rotate(${angle}, ${0},${height/2})`}>
                <g transform={`translate(${width},${height/2}) rotate(${textAngle})`}>
                    <SvgNote
                        hAlign="center" vAlign="top" useContextScale={false}
                        color={color} fontSize={`${width/3}px`}>
                        {children}
                    </SvgNote>
                </g>
                <path d={`M 0,0 c ${width/2},0 0,${height/2} ${width/2},${height/2} c ${-width/2},0 0,${height/2} ${-width/2},${height/2}`}
                    fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            </g>
        </g>
    );
};


const _Watis1M84 = () => {
    const dirkX = 50;
    const dirkHeight = 1.84;
    const dirkHeightStr = `${dirkHeight}`.replace('.', ',');
    const maatstafWidth = 5;
    const maatstafX = 15 + maatstafWidth/2;
    
    const { xScale, yScale } = React.useContext(DrawingContext);
    const dashLength = xScale.metric(1);
    const dashArray = `${dashLength},${dashLength}`;

    const accoladeProps = [
        {
             children: String.raw`**1** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 1,
             x1: 65,
             x2: maatstafX,
        },
        {
             children: String.raw`**${dirkHeightStr}** keer $1~\si{m}$`,
             color: getColor("dark_green"),
             height: dirkHeight,
             x1: 75,
             x2: maatstafX,
        },
        {
             children: String.raw`**2** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 2,
             x1: 85,
             x2: maatstafX,
        },
    ];

    return (
        <>
          {/** <DrawingGrid majorX={10} minorY={0.1} /> **/}
          { accoladeProps.map(({x1, x2, height, color , children}, i) =>
              <g key={i}>
                  <path stroke={color} strokeWidth="2"
                        strokeLinecap="round" strokeDasharray={dashArray}
                        d={`M ${xScale(x1)},${yScale(height)} H ${xScale(x2)}`} />
                  <path stroke={color} strokeWidth="2"
                        strokeLinecap="round" strokeDasharray={dashArray}
                        d={`M ${xScale(x1)},${yScale(0)} H ${xScale(x2)}`} />
                  <TextAccolade x={xScale(x1)} y={yScale(height)} width={xScale.metric(10)} height={yScale.metric(height)} color={color}>
                      {children}
                  </TextAccolade>
              </g>
           )
          }
          <Dirk isFront height={dirkHeight} x={dirkX} y={0} vAlign="bottom" hAlign="center" />
          <Maatstaf width={maatstafWidth} height={2} x={maatstafX} y={0} />
        </>
    );
};

const Watis1M84 = () => {
    return (
        <Drawing xMin={0} xMax={100} yMin={0} yMax={2.2} aspect={16/9} noWatermark>
          <_Watis1M84 />
        </Drawing>
    );
};

export default Watis1M84;
