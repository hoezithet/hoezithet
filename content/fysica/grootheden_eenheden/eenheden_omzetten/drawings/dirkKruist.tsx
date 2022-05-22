import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import _WalkingToStopPerson from "./walkingToStopPerson";
import BreathingPerson from "./breathingPerson";
import Zon from "./park/zon";
import Wolken from "./park/wolken";
import InfScrollingPark from "./park/inf_scrolling_park";
import withInfLoop from "components/withInfLoop";
import withDrawingScale from "components/withDrawingScale";
import { BreathingDirk } from "./dirk";
import { Annot } from "components/shortcodes/annot";
import { AnnotArrow } from "components/shortcodes/annotArrow";
import withSizePositionAngle from "components/withSizePositionAngle";

import { gsap } from "gsap";

const LoopingWolken = withInfLoop(Wolken);

const WalkingToStopPerson = () => {
    const ref = React.useRef();
    const { addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());

    const stepFreq = 2;
    const breatheFreq = 0.2;
    const stepSize = 160;
    const startPos = 0;
    const endPos = 1920*1/3;
    const numCycles = Math.round(Math.abs(endPos - startPos)/(2*stepSize));

    const startPosPx = startPos;
    const endPosPx = endPos;
    const stepSizePx = stepSize;

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
            <_WalkingToStopPerson numCycles={numCycles} stepSize={stepSizePx} stepFreq={stepFreq} breatheFreq={breatheFreq} height={600} y={1080-50} vAlign="bottom" hAlign="right" />
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
              lineWidth={10}
              anchorRadiusTarget={50} anchorRadiusAnnot={50}
              hAlignAnnot="right" vAlignAnnot="bottom" hideHead color="gray"/>
          <Annot x={noteX} y={noteY} width={width} height={1080} fontSize={60}
              hAlign="right"
              vAlign="bottom"
              textPadding=".5em"
              borderRadius=".25em"
              showBackground>
              { text }
          </Annot>
        </g>
    );
};

const _DirkKruistChild = () => {
    const [dirkX, dirkY, dirkHeight] = [1920 * 2/3, 1080-50, 600];

    return (
        <>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-10} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <InfScrollingPark width={3840} x={-1000} />
            <WalkingToStopPerson />
            <TextBallon text={String.raw`Ik ben $1{,}84~\si{m}$ groot!`} gsapPosition={1}/>
            <BreathingDirk flipH height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="left"/>
        </>
    )
};

const DirkKruistChild = withDrawingScale(_DirkKruistChild, 1920, 1080);

const DirkKruist = () => {
    return (
        <Drawing left={0} right={1920.0} bottom={1080.0} top={0} noWatermark>
            <DirkKruistChild />
        </Drawing>
    );
};

export default DirkKruist;


const _DirkZegtTijdChild = () => {
    const [dirkX, dirkY, dirkHeight] = [1920 * 2/3, 1080-50, 600];

    return (
        <>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-5} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <InfScrollingPark width={3840} x={-1000} />
            <BreathingPerson freq={0.5} height={600} x={1920*1/3} y={1080-50} vAlign="bottom" hAlign="right"/>
            <TextBallon text={String.raw`Ik loop al $5623~\si{s}$ rond in dit park!`} gsapPosition={0} width={1000}/>
            <BreathingDirk flipH height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="left"/>
        </>
    );
};

const DirkZegtTijdChild = withDrawingScale(_DirkZegtTijdChild, 1920, 1080);

export const DirkZegtTijd = () => {
    return (
        <Drawing left={0} right={1920.0} bottom={1080.0} top={0} noWatermark>
            <DirkZegtTijdChild />
        </Drawing>
    );
};
