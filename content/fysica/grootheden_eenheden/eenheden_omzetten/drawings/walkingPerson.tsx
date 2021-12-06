import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";
import { gsap } from "gsap";
import {
    Person, getRestPose
} from "components/drawings/person";
import withSizePositionAngle from "components/withSizePositionAngle";
import { getWalkKeypoints } from "./walkCycleKps";

export const withWalking = (Component) => {
    return ({repeat = -1, initialPose = null, ...props}) => {
        const personRef = React.useRef();
        const { addAnimation } = React.useContext(DrawingContext);
        const [tl, setTl] = React.useState(() => gsap.timeline({repeat: repeat}));

        React.useEffect(() => {
            tl.clear();
            initialPose = initialPose === null ? getRestPose() : initialPose;
            const poseKps = getWalkKeypoints({initialPose: initialPose});
            poseKps.forEach(kp => tl.to(personRef.current, kp));
            addAnimation(tl, 0);
        }, []);

        return (
            <Component ref={personRef} {...props} />
        );
    }
};


const WalkingPerson = withSizePositionAngle(withWalking(Person), 100, 100);

export default WalkingPerson;
