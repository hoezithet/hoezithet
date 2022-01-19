import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Dirk from "./dirk";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _ from "lodash";

import { gsap } from "gsap";


const _Blocks = ({x, y, blockHeight, blockWidth, strokeWidth, hText=false, fontSize=null, textAngle=0, numBlocks, blockText=null, color="blue"}, ref) => {
    x -= blockWidth/2;

    color = getColor(color);
    fontSize = `${fontSize !== null ? fontSize : (hText ? blockHeight : blockWidth)*2/3}px`;

    return (
        <g ref={ref}>
            { _.range(numBlocks).map(i => i + 1).map(i => (
                <g key={i} transform={`translate(${x},${y - i*blockHeight})`}>
                    <rect height={blockHeight} width={blockWidth}
                        stroke={getColor("near_white")} fill={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
                    { blockText === null ? null :
                        <g transform={`translate(${blockWidth/2},${blockHeight/2}) rotate(${textAngle + (hText ? 0 : -90)})`}>
                            <SvgNote hAlign="center" vAlign="center"
                                useContextScale={false} fontSize={fontSize}
                                color={getColor("near_white")}>
                                {blockText}
                            </SvgNote>
                        </g>
                    }
                </g>)) }
        </g>
    );
};

const Blocks = React.forwardRef(_Blocks);

const _TextAccolade = ({x1, x2=null, y, flipText=false, hText=false, width, height, strokeWidth, fontSize=null, color="gray", children}, ref) => {
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

    color = getColor(color);

    fontSize = fontSize !== null ? fontSize : width*2/3;
    x2 = x2 === null ? x1 : x2;
    const dashArray = `4,4`;

    const getAccoladeD = (width, height) => {
        return `M 0,0 c ${width},0 0,${-height/2} ${width},${-height/2} c ${-width},0 0,${-height/2} ${-width},${-height/2}`;
    };

    const getNoteTransform = (width, height) => {
        return `translate(${width + (flipText && !hText ? 2*fontSize : 0) + (hText ? width : 0)},${-height/2}) rotate(${(flipText ? -90 : 90) + (hText ? 90 : 0)})`;
    };

    return (
        <g ref={ref}>
            <g transform={`translate(${x1},${y})`}>
                <path ref={line1Ref} stroke={color} strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M ${0},${-height} H ${x2 - x1}`} />
                <path ref={line2Ref} stroke={color} strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M ${0},${0} H ${x2 - x1}`} />
                <g transform={x1 >= x2 ? "" : `translate(${0},${-height}) rotate(180)`}>
                    <g ref={noteRef} transform={getNoteTransform(width, height)}>
                        <SvgNote
                            hAlign={hText ? "left" : "center"} vAlign={hText ? "center" : "bottom"} useContextScale={false}
                            color={color} fontSize={fontSize}>
                            {children}
                        </SvgNote>
                    </g>
                    <path ref={accoladeRef} d={getAccoladeD(width, height)}
                        fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
                </g>
            </g>
        </g>
    );
};

export const TextAccolade = React.forwardRef(_TextAccolade);


const _Watis1M84 = () => {
    const dirkX = 2;
    const dirkHeight = 1.84;
    const dirkHeightStr = `${dirkHeight}`.replace('.', ',');
    const blocksWidth = 0.2;
    const accWidth = 0.2;
    const blocksX = 1 + blocksWidth/2;
    const blockText = String.raw`$1~\si{m}$`;
    
    const { xScale, yScale, addAnimation } = React.useContext(DrawingContext);
    const block1Ref = React.useRef(null);
    const dirkRef = React.useRef(null);
    const block2Ref = React.useRef(null);
    const acc1Ref = React.useRef(null);
    const acc184Ref = React.useRef(null);
    const acc2Ref = React.useRef(null);

    const dashLength = xScale.metric(0.05);
    const strokeWidth = xScale.metric(0.02);

    return (
        <>
          {/** <DrawingGrid majorX={1} majorY={1} minorX={0.10} minorY={0.1} /> **/}
          <TextAccolade x1={xScale(0)} y={yScale(0)} ref={acc1Ref} color={getColor("gray")} width={xScale.metric(accWidth)} height={yScale.metric(1)} x1={xScale(2.5)} x2={xScale(blocksX)} dashLength={dashLength} strokeWidth={strokeWidth}>
              {String.raw`**1** keer $1~\si{m}$`}
          </TextAccolade>
          <TextAccolade x1={xScale(0)} y={yScale(0)} ref={acc184Ref} color={getColor("dark_green")} width={xScale.metric(accWidth)} height={yScale.metric(dirkHeight)} x1={xScale(3)} x2={xScale(blocksX)} dashLength={dashLength} strokeWidth={strokeWidth}>
              {String.raw`**${dirkHeightStr}** keer $1~\si{m}$`}
          </TextAccolade>
          <TextAccolade x1={xScale(0)} y={yScale(0)} ref={acc2Ref} color={getColor("gray")} width={xScale.metric(accWidth)} height={yScale.metric(2)} x1={xScale(3.5)} x2={xScale(blocksX)} dashLength={dashLength} strokeWidth={strokeWidth}>
              {String.raw`**2** keer $1~\si{m}$`}
          </TextAccolade>
          <g ref={dirkRef}>
              <Dirk isFront height={dirkHeight} x={dirkX} y={0} vAlign="bottom" hAlign="center" />
          </g>
          <Blocks ref={block1Ref} x={xScale(blocksX)} y={yScale(0)} blockText={blockText} blockWidth={xScale.metric(blocksWidth)} blockHeight={yScale.metric(1)} strokeWidth={xScale.metric(0.002)} numBlocks={1} />
          <Blocks ref={block2Ref} x={xScale(blocksX)} y={yScale(1)} blockText={blockText} blockWidth={xScale.metric(blocksWidth)} blockHeight={yScale.metric(1)} strokeWidth={xScale.metric(0.002)} numBlocks={1} />
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

const _BlockCounter = ({blocksX, accoladeX, y, numBlocks: _numBlocks, textCallback, fontSize, blockHeight, blockWidth, accStrokeWidth, blockStrokeWidth, accoladeWidth, color="orange"}, ref) => {
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
            <TextAccolade fontSize={(fontSize)} x1={(accoladeX)} x2={(blocksX)} y={(y)} width={(accoladeWidth)} height={(numBlocks*blockHeight)} strokeWidth={accStrokeWidth} color={color}>
                {textCallback(numBlocks)}
            </TextAccolade>
            <Blocks x={blocksX} y={y} blockHeight={blockHeight} blockWidth={blockWidth} strokeWidth={blockStrokeWidth} numBlocks={numBlocks} color={color} />
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
            duration: 2,
            ease: "power2.inOut",
            modifiers: {
                numBlocks: Math.round
            },
        }).from(meterBlockRef.current, {
            x: xScale(0), 
            opacity: 0,
            duration: 1,
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
                <Blocks x={xScale(0.75)} y={yScale(0)} blockText={String.raw`$1~\si{m}$`} textAngle={90} fontSize={yScale.metric(0.09)} blockHeight={yScale.metric(1)} blockWidth={xScale.metric(0.2)} numBlocks={1} color="blue" />
            </g>
            <BlockCounter ref={blockCounterRef} blocksX={xScale(1.25)} accoladeX={xScale(1.5)} y={yScale(0)} numBlocks={0}
                blockWidth={xScale.metric(0.2)} accoladeWidth={xScale.metric(0.2)} blockStrokeWidth={xScale.metric(0.002)}
                accStrokeWidth={xScale.metric(0.01)}
                blockHeight={yScale.metric(0.01)} fontSize={yScale.metric(0.08)}
                textCallback={x => String.raw`**${x}** keer $1~\si{cm}$`} />
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
            duration: 2,
            ease: "power2.inOut",
            modifiers: {
                numBlocks: Math.round
            },
        }).from(meterBlockRef.current, {
            x: xScale(0),
            opacity: 0,
            duration: 1,
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
            <BlockCounter ref={blockCounterRef} blocksX={xScale(1.5)} accoladeX={xScale(1.65)} y={yScale(0)} numBlocks={0}
                  blockWidth={xScale.metric(0.2)} accoladeWidth={xScale.metric(0.2)}
                  blockHeight={yScale.metric(0.01)} fontSize={yScale.metric(0.12)} blockStrokeWidth={xScale.metric(0.002)}
                  accStrokeWidth={xScale.metric(0.01)}
                  textCallback={(numBlocks) => String.raw`**${numBlocks}** keer $1~\si{cm}$`} />
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
