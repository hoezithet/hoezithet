import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import { WalkToStop } from "./walk_cycle";
import Zon from "./park/zon";
import Wolken from "./park/wolken";
import InfScrollingPark from "./park/inf_scrolling_park";
import withInfLoop from "components/withInfLoop";

import { gsap } from "gsap";

const LoopingWolken = withInfLoop(Wolken);

const WalkingPerson = () => {
    const ref = React.useRef();
    const { addAnimation, xScale } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline());

    const freq = 0.75;
    const stepSize = 100;
    const startPos = -1920*1/3;
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
            duration: numCycles/freq,
            ease: "none",
        });
        addAnimation(tl, 0);
    }, [startPosPx, endPosPx, numCycles, freq]);

    return (
        <g ref={ref}>
            <WalkToStop numCycles={numCycles} stepSize={stepSizePx} freq={freq} height={800} x={-100} y={1080-50} vAlign="bottom" hAlign="center" />
        </g>
    );
};



const DirkKruist = () => {
    return (
        <Drawing xMin={0} xMax={1920.0} yMin={1080.0} yMax={0} noWatermark>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-5} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <InfScrollingPark width={3840} x={-1000} />
            <WalkingPerson />
        </Drawing>
    );
};

export default DirkKruist;
