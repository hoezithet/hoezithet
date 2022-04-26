import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import _WalkingToStopPerson from "./walkingToStopPerson";
import BreathingPerson from "./breathingPerson";
import Zon from "./park/zon";
import Wolken from "./park/wolken";
import InfScrollingPark from "./park/inf_scrolling_park";
import withInfLoop from "components/withInfLoop";
import { BreathingDirk } from "./dirk";
import { Annot } from "components/shortcodes/annot";
import { AnnotArrow } from "components/shortcodes/annotArrow";

import { gsap } from "gsap";

const LoopingWolken = withInfLoop(Wolken);

const WalkingToStopPerson = () => {
    const ref = React.useRef();
    const { addAnimation, xScale } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());

    const stepFreq = 2;
    const breatheFreq = 0.2;
    const stepSize = 100;
    const startPos = 0;
    const endPos = 1920*1/3;
    const numCycles = Math.round(Math.abs(endPos - startPos)/(2*stepSize));

    const startPosPx = xScale(startPos);
    const endPosPx = xScale(endPos);
    const stepSizePx = xScale(stepSize) - xScale(0);

    React.useEffect(() => {
        tl.clear();
        tl.fromTo(ref.current, {
            x: startPosPx,
        }, {
            x: endPosPx,
            duration: numCycles/stepFreq,
            ease: "none",
        });
        addAnimation(tl, 0);
    }, [startPosPx, endPosPx, numCycles, stepFreq]);

    return (
        <g ref={ref}>
            <_WalkingToStopPerson numCycles={numCycles} stepSize={stepSizePx} stepFreq={stepFreq} breatheFreq={breatheFreq} height={600} x={-100} y={1080-50} vAlign="bottom" hAlign="right" />
        </g>
    );
};


const TextBallon = ({text, gsapPosition, width=1000}) => {
    const [noteX, noteY] = [1509, 350];
    const ref = React.useRef();
    const { addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());

    React.useEffect(() => {
        tl.clear();
        tl.from(ref.current, {scale: 0, opacity: 0, rotation: 90, transformOrigin: "bottom right", ease: "elastic.out", duration: 2});
        addAnimation(tl, gsapPosition);
    }, []);

    return (
        <g ref={ref}>
          <AnnotArrow annot={{x: noteX - 50, y: noteY - 50}} target={{x: 1445, y: 440}}
              margin={0} hAlignTarget="left"
              hAlignAnnot="right" vAlignAnnot="bottom" hideHead color="light_gray"/>
          <Annot x={noteX} y={noteY} width={width} fontSize={12}
              hAlign="right"
              vAlign="bottom"
              showBackground>
              { text }
          </Annot>
        </g>
    );
};


const DirkKruist = () => {
    const [dirkX, dirkY, dirkHeight] = [1920 * 2/3, 1080-50, 600];

    return (
        <Drawing xMin={0} xMax={1920.0} yMin={1080.0} yMax={0} noWatermark>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-5} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <InfScrollingPark width={3840} x={-1000} />
            <WalkingToStopPerson />
            <TextBallon text={String.raw`Ik ben $1{,}84~\si{m}$ groot!`} gsapPosition={1}/>
            <BreathingDirk flipH height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="left"/>
        </Drawing>
    );
};

export default DirkKruist;


export const DirkZegtTijd = () => {
    const [dirkX, dirkY, dirkHeight] = [1920 * 2/3, 1080-50, 600];

    return (
        <Drawing xMin={0} xMax={1920.0} yMin={1080.0} yMax={0} noWatermark>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-5} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <InfScrollingPark width={3840} x={-1000} />
            <BreathingPerson freq={0.5} height={600} x={1920*1/3} y={1080-50} vAlign="bottom" hAlign="right"/>
            <TextBallon text={String.raw`Ik loop al $5623~\si{s}$ rond in dit park!`} gsapPosition={0} width={900}/>
            <BreathingDirk flipH height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="left"/>
        </Drawing>
    );
};