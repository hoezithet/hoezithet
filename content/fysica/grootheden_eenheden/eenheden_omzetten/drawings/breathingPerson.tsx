import React from "react";
import { DrawingContext } from "components/drawings/drawing";
import { gsap } from "gsap";
import {
    Person, addPoseKeypointToTl, getRestPose
} from "components/drawings/person";
import withSizePositionAngle from "components/withSizePositionAngle";
import { getBreathingKeypoints } from "./breatheCycleKps";

export const withBreathing = (Component) => {
    return ({
        repeat = -1, initialPose = null, breatheFreq = 0.25, breatheAmpl = 2, ...props
    }) => {
        const personRef = React.useRef();
        const { addAnimation } = React.useContext(DrawingContext);
        const [tl, setTl] = React.useState(() => gsap.timeline({repeat: repeat}));

        React.useEffect(() => {
            tl.clear();
            initialPose = initialPose === null ? getRestPose() : initialPose;

            const restTl = gsap.timeline({repeat: -1, paused: true});
            const breatheKps = getBreathingKeypoints({
                initialPose: initialPose,
                freq: breatheFreq,
                ampl: breatheAmpl,
            });
            breatheKps.forEach(kp => restTl.to(personRef.current, kp));

            tl.add(restTl.play());
            addAnimation(tl, 0);
        }, []);

        return (
            <Component ref={personRef} {...props} />
        );
    }
};


const BreathingPerson = withSizePositionAngle(withBreathing(Person), 100, 100);

export default BreathingPerson;
