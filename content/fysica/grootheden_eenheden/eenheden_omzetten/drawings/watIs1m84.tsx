import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Dirk from "./dirk";
import { SvgNote } from "components/shortcodes/svgNote";
import { getColor } from "colors";
import _ from "lodash";

import { gsap } from "gsap";


const _Maatstaf = ({x, y, blockHeight, blockWidth=0.2, strokeWidth=0.005, hText=false, fontSize=null, textAngle=0, hideText=false, numBlocks: _numBlocks, unit, color="blue"}, ref) => {
    const { xScale, yScale } = React.useContext(DrawingContext);
    blockHeight = yScale.metric(blockHeight);
    blockWidth= xScale.metric(blockWidth);
    x = xScale(x) - blockWidth/2;
    y = yScale(y);
    color = getColor(color);
    strokeWidth = xScale.metric(strokeWidth);
    const [numBlocks, setNumBlocks] = React.useState(_numBlocks);

    React.useImperativeHandle(ref, () => ({
        numBlocks: (newValue = null) => {
            if (newValue === null) {
                return numBlocks;
            }
            setNumBlocks(Math.round(newValue));
        },
    }));

    return (
        <g>
            { _.range(numBlocks).map(i => i + 1).map(i => (
                <g key={i} transform={`translate(${x},${y - i*blockHeight})`}>
                    <rect height={blockHeight} width={blockWidth}
                        fill={getColor("near_white")} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
                    { hideText ? null :
                        <g transform={`translate(${blockWidth/2},${blockHeight/2}) rotate(${textAngle + (hText ? 0 : -90)})`}>
                            <SvgNote hAlign="center" vAlign="center"
                                useContextScale={false} fontSize={`${fontSize !== null ? xScale.metric(fontSize) : (hText ? blockHeight : blockWidth)*2/3}px`}
                                color={color}>
                                {String.raw`$1~\si{${unit}}$`}
                            </SvgNote>
                        </g>
                    }
                </g>)) }
        </g>
    );
};

const Maatstaf = React.forwardRef(_Maatstaf);

const _TextAccolade = ({x1=0, x2=null, y=0, hText=false, width: _width, height: _height, strokeWidth="2", fontSize=null, color="gray", children}, ref) => {
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
    const [width, setWidth] = React.useState(_width);
    const [height, setHeight] = React.useState(_height);
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

    React.useImperativeHandle(ref, () => ({
        accHeight: (h = null) => h === null ? height : setHeight(h),
        accWidth: (w = null) => w === null ? width : setWidth(w),
    }));

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
    const maatstafWidth = 0.2;
    const maatstafX = 1 + maatstafWidth/2;
    
    const { xScale, yScale } = React.useContext(DrawingContext);
    const dashLength = xScale.metric(0.05);

    const accoladeProps = [
        {
             children: String.raw`**1** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 1,
             x1: 2.5,
             x2: maatstafX,
        },
        {
             children: String.raw`**${dirkHeightStr}** keer $1~\si{m}$`,
             color: getColor("dark_green"),
             height: dirkHeight,
             x1: 3,
             x2: maatstafX,
        },
        {
             children: String.raw`**2** keer $1~\si{m}$`,
             color: getColor("gray"),
             height: 2,
             x1: 3.5,
             x2: maatstafX,
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
          <Maatstaf x={maatstafX} y={0} blockWidth={maatstafWidth} blockHeight={1} numBlocks={2} unit="m" />
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

const _MeterIs100Cm = () => {
    const { xScale, yScale, addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline({paused: true}));
    const accoladeRef = React.useRef(null);
    const cmBlocksRef = React.useRef(null);
    const meterBlockRef = React.useRef(null);

    React.useEffect(() => {
        tl.clear();
        tl.fromTo(accoladeRef.current, {
            accHeight: 0.01,
        }, {
            accHeight: 1.00,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: () => {
                const height = gsap.getProperty(accoladeRef.current, "accHeight");
                const spanEl = document?.getElementById(cmCountId);
                const numBlocks = Math.round(height*100);
                cmBlocksRef.current?.numBlocks(numBlocks);
                if (spanEl) {
                    spanEl.textContent = `${numBlocks}`;
                }
            },
        }).from(meterBlockRef.current, {
            x: xScale(0), 
            opacity: 0,
            duration: 2,
            ease: "power2.inOut",
        });
        addAnimation(tl.play(), 0);
    }, []);

    const cmCountId = "cmCount";

    return (
        <>
            <TextAccolade ref={accoladeRef} fontSize={0.09} x1={1.5} x2={1.35} y={0} width={0.1} height={0} color="orange">
                {String.raw`$\htmlId{${cmCountId}}{0}$ keer $1~\si{cm}$`}
            </TextAccolade>
            <g ref={meterBlockRef}>
                <SvgNote x={1} y={0.5} vAlign="center" hAlign="center">
                    {String.raw`$=$`}
                </SvgNote>
                <Maatstaf x={0.75} y={0} textAngle={90} fontSize={0.09} blockHeight={1} numBlocks={1} unit="m" color="blue" />
            </g>
            <Maatstaf ref={cmBlocksRef} x={1.25} y={0} hideText blockHeight={0.01} numBlocks={0} unit="cm" color="orange" />
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

export default Watis1M84;
