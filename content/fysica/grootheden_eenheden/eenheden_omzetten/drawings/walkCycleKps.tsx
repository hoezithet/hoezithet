import _range from "lodash/range";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";

import { PoseType } from "components/drawings/person";


export type WalkCycleProps = {
    initialPose: PoseType,
    freq: number,
    numKeypoints: number,
    shoulderAmplX: number,
    shoulderAmplY: number,
    handAmplX: number,
    handAmplY: number,
    hipAmplX: number,
    hipAmplY: number,
    footAmplX: number,
    footAmplY: number,
}


export const getWalkKeypoints = ({
    initialPose, freq=0.75, numKeypoints=8, shoulderAmplX=0,
    shoulderAmplY=0, handAmplX=10, handAmplY=3, hipAmplX=0,
    hipAmplY=1, footAmplX=12, footAmplY=8
}: WalkCycleProps) => {
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
            duration: i === 0 ? 0 : kpDuration,
            ...getWalkPoseAtTime(t, initialPose, ampl, freq)
        }));

    return keypoints;
};


export const getWalkPoseAtTime = (time, pose, ampl, freq) => {
    const hipHeadDist = pose.rHipY - pose.headY;
    const hipShoulderDist = pose.rHipY - pose.rShoulderY;
    const hipTorsoDistY = pose.rHipY - pose.bodyTopY;
    const hipTorsoDistX = pose.rHipX - pose.bodyTopX;
    const hipBottomDistY = pose.rHipY - pose.bodyBottomY;
    const hipBottomDistX = pose.rHipX - pose.bodyBottomX;

    const newRHand = getWalkingHand(time, {x: pose.rHandX, y: pose.rHandY}, ampl.rHand, freq, Math.PI);
    const newLHand = getWalkingHand(time, {x: pose.lHandX, y: pose.lHandY}, ampl.lHand, freq, 0);
    const newRHip = getWalkingHip(time, {x: pose.rHipX, y: pose.rHipY}, ampl.rHip, freq, 0);
    const newLHip = getWalkingHip(time, {x: pose.lHipX, y: pose.lHipY}, ampl.lHip, freq, Math.PI);
    const newRFoot = getWalkingFoot(time, {x: pose.rFootX, y: pose.rFootY}, ampl.rFoot, freq, 0);
    const newLFoot = getWalkingFoot(time, {x: pose.lFootX, y: pose.lFootY}, ampl.lFoot, freq, Math.PI);
    const newHeadY = newRHip.y - hipHeadDist;

    const poseOverrides = {
        headY: newHeadY,
        rShoulderY: newRHip.y - hipShoulderDist,
        rHandX: newRHand.x,
        rHandY: newRHand.y,
        lShoulderY: newRHip.y - hipShoulderDist,
        lHandX: newLHand.x,
        lHandY: newLHand.y,
        bodyTopX: newRHip.x - hipTorsoDistX,
        bodyTopY: newRHip.y - hipTorsoDistY,
        bodyBottomX: newRHip.x - hipBottomDistX,
        bodyBottomY: newRHip.y - hipBottomDistY,
        rHipX: newRHip.x,
        rHipY: newRHip.y,
        rFootX: newRFoot.x,
        rFootY: newRFoot.y,
        lHipX: newLHip.x,
        lHipY: newLHip.y,
        lFootX: newLFoot.x,
        lFootY: newLFoot.y,
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
