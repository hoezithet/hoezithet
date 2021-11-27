import React, { useContext } from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import _ from "lodash";
import { AnimatedPerson, getRestPose } from "components/drawings/person";



const _WalkCycle = ({color="#000000", outline="#efefef"}) => {
    const initialPose = getRestPose();
    const poseKps = getWalkKeypoints(initialPose);

    return (
        <AnimatedPerson poseKeypoints={poseKps} color={color} outline={outline} />
    );
};

const WalkCycle = withSizePositionAngle(_WalkCycle, 100, 100);


const getWalkKeypoints = (initialPose, freq=0.75, numKeypoints=8, color="#000000", outline="#efefef", shoulderAmplX=0, shoulderAmplY=0, handAmplX=10, handAmplY=3, hipAmplX=0, hipAmplY=1, footAmplX=12, footAmplY=8) => {
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

    const keypoints = _.range(numKeypoints)
        .map(i => i*kpDuration)
        .map(t => ({
            time: t,
            duration: kpDuration,
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

    const newPose = _.cloneDeep(pose);
    _.merge(newPose, poseOverrides);

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
