import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Dirk from "./dirk";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _ from "lodash";


const MetingDirk = ({x1, x2, y, width=10, pad=3, color="dark_green"}) => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const x1Px = xScale(x1);
    const x2Px = xScale(x2);
    const yPx = yScale(y);
    const heightPx = Math.abs(yScale(y) - yScale(0));
    const widthPx = Math.abs(xScale(width) - xScale(0));

    pad = Math.abs(xScale(pad) - xScale(0));

    const dashArray = "4,4";

    const heightStr = `${y}`.replace('.', ',');
    color = getColor(color);

    return (
        <g>
            <path stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeDasharray={dashArray}
                d={`M ${x1Px},${yPx} H ${x2Px}`} />
            <path stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeDasharray={dashArray}
                d={`M ${x1Px},${yScale(0)} H ${x2Px}`} />
            <g transform={`translate(${x2Px}, ${yPx})`}>
              <g transform={`rotate(180, 0, ${heightPx/2})`}>
                <TextAccolade width={widthPx} height={heightPx} color={color}>
                    {String.raw`**${heightStr}** keer $1~\si{m}$`}
                </TextAccolade>
              </g>
            </g>
        </g>
    );
}


const Maatstaf = ({x, y, height, width, color="blue", strokeColor="gray"}) => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    const heightPx = Math.abs(yScale(height) - yScale(0));
    const widthPx = Math.abs(xScale(width) - xScale(0));
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

const TextAccolade = ({x=0, y=0, width, height, textAngle=90, strokeWidth="2", color="gray", children}) => {
    color = getColor(color);

    return (
        <g transform={`translate(${x},${y})`}>
            <g transform={`rotate(180, ${0},${height/2})`}>
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
    const dirkX = 60;
    const dirkHeight = 1.84;
    const dirkHeightStr = `${dirkHeight}`.replace('.', ',');
    const metingX = 40;
    const maatstafWidth = 5;
    
    const { xScale, yScale } = React.useContext(DrawingContext);
    const dirkHeightPx = Math.abs(yScale(dirkHeight) - yScale(0));
    const widthPx = Math.abs(xScale(10) - xScale(0));
    const dashArray = "4,4";

    return (
        <>
          <DrawingGrid majorX={10} minorY={0.1} />
          <g transform={`translate(${xScale(30)} ${yScale(1)})`}>
              <path stroke={getColor("blue")} strokeWidth="2"
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M 0,0 H ${Math.abs(xScale(10) - xScale(0))}`} />
              <TextAccolade x={0} y={0} width={widthPx} height={Math.abs(yScale(1) - yScale(0))} color={getColor("blue")}>
                  {String.raw`**1** keer $1~\si{m}$`}
              </TextAccolade>
          </g>
          <g transform={`translate(${xScale(20)} ${yScale(dirkHeight)})`}>
              <path stroke={getColor("dark_green")} strokeWidth="2"
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M 0,0 H ${Math.abs(xScale(20) - xScale(0))}`} />
              <TextAccolade x={0} y={0} width={widthPx} height={Math.abs(yScale(dirkHeight) - yScale(0))} color={getColor("dark_green")}>
                  {String.raw`**${dirkHeightStr}** keer $1~\si{m}$`}
              </TextAccolade>
          </g>
          <g transform={`translate(${xScale(10)} ${yScale(2)})`}>
              <path stroke={getColor("blue")} strokeWidth="2"
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M 0,0 H ${Math.abs(xScale(30) - xScale(0))}`} />
              <TextAccolade x={0} y={0} width={widthPx} height={Math.abs(yScale(2) - yScale(0))} color={getColor("blue")}>
                  {String.raw`**2** keer $1~\si{m}$`}
              </TextAccolade>
          </g>
          <Dirk isFront height={dirkHeight} x={dirkX} y={0} vAlign="bottom" hAlign="center" />
          <Maatstaf width={maatstafWidth} height={2} x={metingX} y={0} />
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
