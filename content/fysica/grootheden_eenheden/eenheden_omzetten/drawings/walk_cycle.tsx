import React, { useContext } from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import _last from "lodash/last";
import _range from "lodash/range";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";
import {
    Person, addPoseKeypointToTl, getRestPose
} from "components/drawings/person";
import { DrawingContext } from "components/shortcodes/drawing";
import { gsap } from "gsap";



const _WalkCycle = ({color="#000000", outline="#efefef"}) => {
    const personRef = React.useRef();
    const { addAnimation } = React.useContext(DrawingContext);
    const [tl, setTl] = React.useState(() => gsap.timeline({repeat: -1}));

    React.useEffect(() => {
        tl.clear();
        const initialPose = getRestPose();
        const poseKps = getWalkKeypoints({initialPose: initialPose});
        poseKps.forEach(kp => addPoseKeypointToTl(kp, personRef, tl));
        addAnimation(tl, 0);
    }, []);

    return (
        <Person ref={personRef} color={color} outline={outline} />
    );
};

const WalkCycle = withSizePositionAngle(_WalkCycle, 100, 100);

const _WalkToStop = ({
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
        walkKps.forEach(kp => addPoseKeypointToTl(kp, personRef, walkTl));
        walkToStopTl.add(walkTl, 0);

        const lastPose = _last(walkKps);
        addPoseKeypointToTl({
            pose: initialPose,
            time: walkToStopTl.totalDuration(),
            duration: lastPose.duration
        }, personRef, walkToStopTl);
        // const timeScaledWalkToStop = gsap.to(walkToStopTl, {timeScale: 0.5, ease: "none"});

        const restTl = gsap.timeline({repeat: -1, paused: true});
        const breatheKps = getBreathingKeypoints({
            initialPose: initialPose,
            freq: breatheFreq,
            ampl: breatheAmpl,
        });
        breatheKps.forEach(kp => addPoseKeypointToTl(kp, personRef, restTl));

        tl.add(walkToStopTl, 0)
           .add(restTl.play());

        addAnimation(tl, 0);
    }, [numCycles, stepSize, stepFreq, breatheFreq, breatheAmpl]);

    return (
        <Person ref={personRef} color={color} outline={outline} />
    );
};

export const WalkToStop = withSizePositionAngle(_WalkToStop, 100, 100);


const getBreathingKeypoints = ({
    initialPose, freq=0.5, numKeypoints=8, ampl=5
}) => {
    const period = 1/freq;
    const kpDuration = period/numKeypoints;

    const keypoints = _range(numKeypoints + 1)
        .map(i => i*kpDuration)
        .map((t, i, arr) => ({
            time: i === 0 ? 0 : (i - 1)*kpDuration,
            duration: i === 0 ? 0 : kpDuration,
            pose: getBreathingPoseAtTime(t, initialPose, ampl, freq)
        }));

    return keypoints;
};


const getBreathingPoseAtTime = (t, pose, ampl, freq) => {
    const shift = ampl * Math.sin(2*Math.PI*freq*t);
    const poseOverrides = {
        head: {
            start: {
                y: pose.head.start.y + shift,
            },
            end: {
                y: pose.head.start.y + shift,
            },
        },
        rArm: {
            start: {
                y: pose.rArm.start.y + shift,
            },
            end: {
                y: pose.rArm.end.y + shift,
            },
        },
        lArm: {
            start: {
                y: pose.lArm.start.y + shift,
            },
            end: {
                y: pose.lArm.end.y + shift,
            },
        },
        body: {
            start: {
                y: pose.body.start.y + shift,
            },
        },
    };
    const newPose = _cloneDeep(pose);
    _merge(newPose, poseOverrides);

    return newPose;
};


const getWalkKeypoints = ({initialPose, freq=0.75, numKeypoints=8, shoulderAmplX=0, shoulderAmplY=0, handAmplX=10, handAmplY=3, hipAmplX=0, hipAmplY=1, footAmplX=12, footAmplY=8}) => {
    const ampl = {
        rHand: {
            x: handAmplX,
            y: handAmplY,
        },
        lHand: {
            x: handAmplX,
            y: handAmplY,
        },
        rHip: {
            x: hipAmplX,
            y: hipAmplY,
        },
        lHip: {
            x: hipAmplX,
            y: hipAmplY,
        },
        rFoot: {
            x: footAmplX,
            y: footAmplY,
        },
        lFoot: {
            x: footAmplX,
            y: footAmplY,
        },
    };

    const period = 1/freq;
    const kpDuration = period/numKeypoints;

    const keypoints = _range(numKeypoints + 1)
        .map(i => i*kpDuration)
        .map((t, i, arr) => ({
            time: i === 0 ? 0 : (i - 1)*kpDuration,
            duration: i === 0 ? 0 : kpDuration,
            pose: getWalkPoseAtTime(t, initialPose, ampl, freq)
        }));

    return keypoints;
};


const getWalkPoseAtTime = (time, pose, ampl, freq) => {
    const newRHip = getWalkingHip(time, pose.rLeg.start, ampl.rHip, freq, 0);
    const hipHeadDist = pose.rLeg.start.y - pose.head.start.y;
    const hipShoulderDist = pose.rLeg.start.y - pose.rArm.start.y;
    const hipTorsoDist = pose.rLeg.start.y - pose.body.start.y;
    const hipBottomDist = pose.rLeg.start.y - pose.body.end.y;

    const newHeadY = newRHip.y - hipHeadDist;

    const poseOverrides = {
        head: {
            start: {
                y: newHeadY,
            },
            end: {
                y: newHeadY,
            },
        },
        rArm: {
            start: {
                y: newRHip.y - hipShoulderDist,
            },
            end: getWalkingHand(time, pose.rArm.end, ampl.rHand, freq, Math.PI),
        },
        lArm: {
            start: {
                y: newRHip.y - hipShoulderDist,
            },
            end: getWalkingHand(time, pose.lArm.end, ampl.lHand, freq, 0),
        },
        rLeg: {
            start: newRHip,
            end: getWalkingFoot(time, pose.rLeg.end, ampl.rFoot, freq, 0),
        },
        lLeg: {
            start: getWalkingHip(time, pose.lLeg.start, ampl.lHip, freq, Math.PI),
            end: getWalkingFoot(time, pose.lLeg.end, ampl.lFoot, freq, Math.PI),
        },
        body: {
            start: {
                y: newRHip.y - hipTorsoDist,
            },
            end: {
                y: newRHip.y - hipBottomDist,
            }, 
        },
    };

    const newPose = _cloneDeep(pose);
    _merge(newPose, poseOverrides);

    return newPose;
};

const getWalkingHip = (time, hip, ampl, walkFreq, phi) => {
    return {
        x: hip.x,
        y: hip.y + ampl.y * Math.sin(4 * Math.PI * walkFreq * time)
    };
};

const getWalkingFoot = (time, foot, ampl, freq, phi) => {
    return {
        x: foot.x + ampl.x * Math.sin(2 * Math.PI * freq * time + phi),
        y: foot.y - ampl.y * Math.max(0, Math.cos(2 * Math.PI * freq * time + phi))
    };
};

const getWalkingShoulder = (time, shoulder, ampl, freq, phi) => {
    return {
        x: shoulder.x,
        y: shoulder.y + ampl.y * Math.cos(2 * Math.PI * freq * time + phi),
    };
};

const getWalkingHand = (time, hand, ampl, freq, phi) => {
    return {
        x: hand.x + ampl.x * Math.sin(2 * Math.PI * freq * time + phi),
        y: hand.y - ampl.y + Math.abs(ampl.y * Math.cos(2 * Math.PI * freq * time + phi)),
    };
};

export default WalkCycle;
