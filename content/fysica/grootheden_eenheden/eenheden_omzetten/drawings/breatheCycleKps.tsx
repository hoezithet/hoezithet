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
            time: i === 0 ? 0 : (i - 1)*kpDuration,
            duration: i === 0 ? 0 : kpDuration,
            pose: getBreathingPoseAtTime(t, initialPose, ampl, freq)
        }));

    return keypoints;
};


export const getBreathingPoseAtTime = (t, pose, ampl, freq) => {
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
