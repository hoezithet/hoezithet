import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";
import { gsap } from "gsap";
import _last from "lodash/last";
import withSizePositionAngle from "components/withSizePositionAngle";
import {
    Person, getRestPose
} from "components/drawings/person";
import { getWalkKeypoints } from "./walkCycleKps";
import { getBreathingKeypoints } from "./breatheCycleKps";


const _WalkingToStopPerson = ({
    color="#000000", outline="#efefef", numCycles = 3,
    stepSize = 12, stepFreq = 0.75, breatheFreq = 0.25,
    breatheAmpl = 1,
}) => {
    const personRef = React.useRef();
    const [tl, setTl] = React.useState(() => gsap.timeline());
    const { addAnimation } = React.useContext(DrawingContext);

    React.useEffect(() => {
        tl.clear();

        const initialPose = getRestPose(); 
        const walkKps = getWalkKeypoints({
            initialPose: initialPose,
            footAmplX: stepSize/2,
            freq: stepFreq,
        });

        const walkToStopTl = gsap.timeline();
        const walkTl = gsap.timeline({repeat: numCycles - 1});
        walkKps.forEach(kp => walkTl.to(personRef.current, kp));
        walkToStopTl.add(walkTl, 0);

        const lastPose = _last(walkKps);
        walkToStopTl.to(personRef.current, {...initialPose, duration: lastPose.duration});

        const restTl = gsap.timeline({repeat: -1, paused: true});
        const breatheKps = getBreathingKeypoints({
            initialPose: initialPose,
            freq: breatheFreq,
            ampl: breatheAmpl,
        });
        breatheKps.forEach(kp => restTl.to(personRef.current, kp));

        tl.add(walkToStopTl, 0)
           .add(restTl.play());

        addAnimation(tl, 0);
    }, [numCycles, stepSize, stepFreq, breatheFreq, breatheAmpl]);

    return (
        <Person ref={personRef} color={color} outline={outline} />
    );
};

const WalkingToStopPerson = withSizePositionAngle(_WalkingToStopPerson, 100, 100);

export default WalkingToStopPerson;
