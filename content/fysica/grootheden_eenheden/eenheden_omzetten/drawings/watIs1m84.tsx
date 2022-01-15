import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Dirk from "./dirk";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _ from "lodash";

import { gsap } from "gsap";


const _Blocks = ({x, y, blockHeight, blockWidth=0.2, strokeWidth=0.005, hText=false, fontSize=null, textAngle=0, numBlocks, blockText=null, color="blue"}, ref) => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    blockHeight = yScale.metric(blockHeight);
    blockWidth= xScale.metric(blockWidth);
    x = xScale(x) - blockWidth/2;
    y = yScale(y);
    color = getColor(color);
    strokeWidth = xScale.metric(strokeWidth);
    fontSize = `${fontSize !== null ? xScale.metric(fontSize) : (hText ? blockHeight : blockWidth)*2/3}px`;

    return (
        <g>
            { _.range(numBlocks).map(i => i + 1).map(i => (
                <g key={i} transform={`translate(${x},${y - i*blockHeight})`}>
                    <rect height={blockHeight} width={blockWidth}
                        fill={getColor("near_white")} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
                    { blockText === null ? null :
                        <g transform={`translate(${blockWidth/2},${blockHeight/2}) rotate(${textAngle + (hText ? 0 : -90)})`}>
                            <SvgNote hAlign="center" vAlign="center"
                                useContextScale={false} fontSize={fontSize}
                                color={color}>
                                {blockText}
                            </SvgNote>
                        </g>
                    }
                </g>)) }
        </g>
    );
};

const Blocks = React.forwardRef(_Blocks);

const _TextAccolade = ({x1=0, x2=null, y=0, hText=false, width, height, strokeWidth="2", fontSize=null, color="gray", children}, ref) => {
    /**
     * x1: Start of the dashed line
     * x2: End of the dashed line
     * y: Bottom of the accolade
     * width: width of the accolade (excluding text and dashed lines)
     * height: height of the accolade
     **/
    const accoladeRef = React.useRef(null);
    const line1Ref = React.useRef(null);
    const line2Ref = React.useRef(null);
    const noteRef = React.useRef(null);
    const baseGroupRef = React.useRef(null);

    const { xScale, yScale } = React.useContext(DrawingContext);

    color = getColor(color);

    fontSize = `${fontSize !== null ? xScale.metric(fontSize) : xScale.metric(width)*2/3}px`;
    x2 = x2 === null ? x1 : x2;
    const dashArray = `4,4`;

    const getAccoladeD = (width, height) => {
        width = xScale.metric(width);
        height = yScale.metric(height);
        return `M 0,0 c ${width},0 0,${height/2} ${width},${height/2} c ${-width},0 0,${height/2} ${-width},${height/2}`;
    };

    const getNoteTransform = (width, height) => {
        width = xScale.metric(width);
        height = yScale.metric(height);
        return `translate(${width},${height/2}) rotate(${hText ? 0 : 90})`;
    };

    return (
        <g ref={baseGroupRef} transform={`translate(${xScale(x1)},${yScale(y + height)})`}>
            <path ref={line1Ref} stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeDasharray={dashArray}
                d={`M ${0},${yScale.metric(height)} H ${xScale(x2)-xScale(x1)}`} />
            <path ref={line2Ref} stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeDasharray={dashArray}
                d={`M ${0},${0} H ${xScale(x2)-xScale(x1)}`} />
            <g ref={noteRef} transform={getNoteTransform(width, height)}>
                <SvgNote
                    hAlign={hText ? "left" : "center"} vAlign="bottom" useContextScale={false}
                    color={color} fontSize={fontSize}>
                    {children}
                </SvgNote>
            </g>
            <path ref={accoladeRef} d={getAccoladeD(width, height)}
                fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    );
};

const TextAccolade = React.forwardRef(_TextAccolade);


const _Watis1M84 = () => {
    const dirkX = 2;
    const dirkHeight = 1.84;
    const dirkHeightStr = `${dirkHeight}`.replace('.', ',');
    const blocksWidth = 0.2;
    const blocksX = 1 + blocksWidth/2;
    
    const { xScale, yScale } = React.useContext(DrawingContext);
    const dashLength = xScale.metric(0.05);

    const accoladeProps = [
        {
             children: String.raw`**1** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 1,
             x1: 2.5,
             x2: blocksX,
        },
        {
             children: String.raw`**${dirkHeightStr}** keer $1~\si{m}$`,
             color: getColor("dark_green"),
             height: dirkHeight,
             x1: 3,
             x2: blocksX,
        },
        {
             children: String.raw`**2** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 2,
             x1: 3.5,
             x2: blocksX,
        },
    ];

    return (
        <>
          {/** <DrawingGrid majorX={1} majorY={1} minorX={0.10} minorY={0.1} /> **/}
          { accoladeProps.map(({x1, x2, height, color , children}, i) =>
              <g key={i}>
                  <TextAccolade x1={x1} x2={x2} y={0} width={0.2} height={height} color={color}>
                      {children}
                  </TextAccolade>
              </g>
           )
          }
          <Dirk isFront height={dirkHeight} x={dirkX} y={0} vAlign="bottom" hAlign="center" />
          <Blocks x={blocksX} y={0} blockText={String.raw`$1~\si{m}$`} blockWidth={blocksWidth} blockHeight={1} numBlocks={2} unit="m" />
        </>
    );
};

const Watis1M84 = () => {
    return (
        <Drawing xMin={0} xMax={4} yMin={0} yMax={2.25} aspect={16/9} noWatermark>
          <_Watis1M84 />
        </Drawing>
    );
};

const _BlockCounter = ({blocksX, accoladeX, y, numBlocks: _numBlocks, textCallback, fontSize, blockHeight, blockWidth=0.2, accoladeWidth=0.2, color="orange"}, ref) => {
    const [numBlocks, setNumBlocks] = React.useState(_numBlocks);

    React.useImperativeHandle(ref, () => ({
        numBlocks: (newValue = null) => {
            if (newValue === null) {
                return numBlocks;
            }
            setNumBlocks(newValue);
        }
    }));

    return (
        <>
            <TextAccolade fontSize={fontSize} x1={accoladeX} x2={blocksX} y={y} width={accoladeWidth} height={numBlocks*blockHeight} color={color}>
                {textCallback(numBlocks)}
            </TextAccolade>
            <Blocks x={blocksX} y={y} blockHeight={blockHeight} numBlocks={numBlocks} color={color} />
        </>
    );
};

const BlockCounter = React.forwardRef(_BlockCounter);

const _MeterIs100Cm = () => {
    const { xScale, yScale, addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());
    const meterBlockRef = React.useRef(null);
    const blockCounterRef = React.useRef(null);

    React.useEffect(() => {
        tl.clear();
        tl.to(blockCounterRef.current, {
            numBlocks: 100,
            duration: 3,
            ease: "power2.inOut",
            modifiers: {
                numBlocks: Math.round
            },
        }).from(meterBlockRef.current, {
            x: xScale(0), 
            opacity: 0,
            duration: 2,
            ease: "power2.inOut",
        });
        addAnimation(tl, 0);
    }, []);

    return (
        <>
            <g ref={meterBlockRef}>
                <SvgNote x={1} y={0.5} vAlign="center" hAlign="center">
                    {String.raw`$=$`}
                </SvgNote>
                <Blocks x={0.75} y={0} blockText={String.raw`$1~\si{m}$`} textAngle={90} fontSize={0.09} blockHeight={1} numBlocks={1} color="blue" />
            </g>
            <BlockCounter ref={blockCounterRef} blocksX={1.25} accoladeX={1.5} y={0} numBlocks={0}
                blockHeight={0.01} fontSize={0.08}
                textCallback={x => String.raw`$${x}$ keer $1~\si{cm}$`} />
        </>
    );
};

export const MeterIs100Cm = () => {
    return (
        <Drawing xMin={0} xMax={2} yMin={0} yMax={1.125} aspect={16/9} noWatermark>
            <_MeterIs100Cm/>
        </Drawing>
    );
};


const _DirkInCm = () => {
    const { xScale, yScale, addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());
    const blockCounterRef = React.useRef(null);
    const meterBlockRef = React.useRef(null);

    React.useEffect(() => {
        tl.clear();
        tl.to(blockCounterRef.current, {
            numBlocks: 184,
            duration: 3,
            ease: "power2.inOut",
            modifiers: {
                numBlocks: Math.round
            },
        }).from(meterBlockRef.current, {
            x: xScale(0),
            opacity: 0,
            duration: 2,
            ease: "power2.inOut",
        });
        addAnimation(tl, 0);
    }, []);

    return (
        <>
            {/** <DrawingGrid majorX={1} majorY={1} minorX={0.10} minorY={0.1} /> **/}
            <g ref={meterBlockRef}>
                <SvgNote x={1} y={1.1} vAlign="center" hAlign="center">
                    {String.raw`$=$`}
                </SvgNote>
                <Dirk isFront height={1.84} x={0.5} y={0} vAlign="bottom" hAlign="center" />
            </g>
            <BlockCounter ref={blockCounterRef} blocksX={1.5} accoladeX={1.65} y={0} numBlocks={0}
                  blockHeight={0.01} fontSize={0.08}
                  textCallback={(numBlocks) => String.raw`$${numBlocks}$ keer $1~\si{cm}$`} />
        </>
    );
};

export const DirkInCm = () => {
    return (
        <Drawing xMin={0} xMax={2} yMin={0} yMax={2.25} aspect={16/9} noWatermark>
            <_DirkInCm />
        </Drawing>
    );
};

export default Watis1M84;
