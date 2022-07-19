import _range from "lodash/range";
import _cloneDeep from "lodash/cloneDeep";
import _merge from "lodash/merge";


export const getBreathingKeypoints = ({
    initialPose, freq=0.5, numKeypoints=8, ampl=5
}) => {
    const period = 1/freq;
    const kpDuration = period/numKeypoints;

    const keypoints = _range(numKeypoints + 1)
        .map(i => i*kpDuration)
        .map((t, i, arr) => ({
            duration: i === 0 ? 0 : kpDuration,
            ...getBreathingPoseAtTime(t, initialPose, ampl, freq)
        }));

    return keypoints;
};


export const getBreathingPoseAtTime = (t, pose, ampl, freq) => {
    const shift = ampl * Math.sin(2*Math.PI*freq*t);
    const poseOverrides = {
        headY: pose.headY + shift,
        rShoulderY: pose.rShoulderY + shift,
        rHandY: pose.rHandY + shift,
        lShoulderY: pose.lShoulderY + shift,
        lHandY: pose.lHandY + shift,
        bodyTopY: pose.bodyTopY + shift,
    };
    const newPose = _cloneDeep(pose);
    _merge(newPose, poseOverrides);

    return newPose;
};
