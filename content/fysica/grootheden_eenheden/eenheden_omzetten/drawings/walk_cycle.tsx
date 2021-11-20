import React, { useContext } from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import _ from "lodash";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";


if (typeof window !== "undefined") {
    gsap.registerPlugin(MorphSVGPlugin);
}

const _Person = ({ pose=null, color, outline }, ref) => {
    const lLegRef = React.useRef();
    const lArmRef = React.useRef();
    const rLegRef1 = React.useRef();
    const rLegRef2 = React.useRef();
    const rArmRef = React.useRef();
    const headRef = React.useRef();
    const bodyRef = React.useRef();

    pose = pose === null  ? getRestPose() : pose;

    React.useImperativeHandle(ref, () => ({
      get head() {
          return headRef.current.refs;
      },
      get rArm() {
          return rArmRef.current.refs;
      },
      get lArm() {
          return lArmRef.current.refs;
      },
      get body() {
          return bodyRef.current.refs;
      },
      get rLeg() {
          return [...rLegRef1.current.refs,
                  ...rLegRef2.current.refs];
      },
      get lLeg() {
          return lLegRef.current.refs;
      },
    }));

    return (
        <g>
          <RubberHose ref={lArmRef} hoseModel={pose.lArm} color={color} outline={outline} />
          <RubberHose ref={lLegRef} hoseModel={pose.lLeg} color={color} outline={outline} />
          <RubberHose ref={rLegRef1} hoseModel={pose.rLeg} color={color} outline={outline} />
          <RubberHose ref={headRef} hoseModel={pose.head} color={color} outline={outline}  />
          <RubberHose ref={bodyRef} hoseModel={pose.body} color={color} outline={outline}  />
          <RubberHose ref={rLegRef2} hoseModel={pose.rLeg} color={color} />
          <RubberHose ref={rArmRef} hoseModel={pose.rArm} color={color} outline={outline} />
        </g>
    );
};

const Person = React.forwardRef(_Person);

const AnimatedPerson = ({ poseKeypoints, color="#000000", outline="#efefef" }) => {
    const personRef = React.useRef();

    const addKeypointToTl = ({time, duration, pose}, tl) => {
        Object.entries(pose).forEach(([hoseName, hose]) => {
            personRef.current[hoseName].forEach(el =>
                tl.to(el, {morphSVG: hose.d, duration: duration, ease: "none"}, time)
            );
        });
    }

    React.useEffect(() => {
        const tl = gsap.timeline({repeat: -1});
        poseKeypoints.forEach(kp => addKeypointToTl(kp, tl));
    }, []);

    return (
        <Person ref={personRef} pose={_.last(poseKeypoints).pose} color={color} outline={outline} />
    );
};

const _WalkCycle = ({color="#000000", outline="#efefef"}) => {
    const initialPose = getRestPose();
    const poseKps = getWalkKeypoints(initialPose);

    return (
        <AnimatedPerson poseKeypoints={poseKps} color={color} outline={outline} />
    );
};


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

const getRestPose = (headSize=14, armWidth=6, armLength=30, armBendRadius=-2.0, legWidth=8, legLength=40, legBendRadius=2.0, bodyWidth=13, bodyHeight=20, bodyBendRadius=-2.0) => {
    const rFoot = {
        x: 50,
        y: 100 - legWidth/2
    };
    const lFoot = {...rFoot};
    const rHip = {
        x: rFoot.x,
        y: rFoot.y - legLength * 0.8
    };
    const lHip = {...rHip};
    const torso = {
        x: rHip.x + bodyWidth/4,
        y: rHip.y - bodyHeight*0.9
    };
    const bottom = {
        x: rHip.x,
        y: rHip.y,
    };
    const rShoulder = {
        x: torso.x + 1,
        y: torso.y,
    };
    const lShoulder = {...rShoulder};
    const rHand = {
        x: rShoulder.x,
        y: rShoulder.y + armLength * 0.8
    };
    const lHand = {...rHand};

    const headPoint = {
        x: torso.x + headSize*0.3,
        y: rShoulder.y - headSize,
    };

    const head = new RubberHoseModel(headPoint, headPoint, headSize, 0);
    const rArm = new RubberHoseModel(rShoulder, rHand, armWidth, armLength, armBendRadius);
    const lArm = new RubberHoseModel(lShoulder, lHand, armWidth, armLength, armBendRadius);
    const body = new RubberHoseModel(torso, bottom, bodyWidth, bodyHeight, bodyBendRadius);
    const rLeg = new RubberHoseModel(rHip, rFoot, legWidth, legLength, legBendRadius);
    const lLeg = new RubberHoseModel(lHip, lFoot, legWidth, legLength, legBendRadius);

    return {
        head: head,
        rArm: rArm,
        lArm: lArm,
        body: body,
        lLeg: lLeg,
        rLeg: rLeg,
    };
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

const _RubberHose = ({hoseModel, color, outline=null, outlineWidth=1}, ref) => {
    const hoseRef = React.useRef();
    const outlineRef = React.useRef();

    React.useImperativeHandle(ref, () => ({
      get refs() {
          return [hoseRef.current, outlineRef.current];
      },
    }));

    return (
        <>
            <path ref={outlineRef} d={hoseModel.d} stroke={outline || "rgba(0,0,0,0)"} fillOpacity={0} strokeWidth={hoseModel.width + outlineWidth} strokeLinecap="round" />
            <path ref={hoseRef} d={hoseModel.d} stroke={color} fillOpacity={0} strokeWidth={hoseModel.width} strokeLinecap="round" />
        </>
    );
}

const RubberHose = React.forwardRef(_RubberHose); 

class RubberHoseModel {
    constructor(start, end, width, length, bendRadius = 1.0) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.bendRadius = bendRadius;
        this.length = length;
    }

    get d() {
        const [ctrlStart, ctrlEnd] = this.ctrlPoints;
        return `M ${this.start.x},${this.start.y} C ${ctrlStart.x},${ctrlStart.y} ${ctrlEnd.x},${ctrlEnd.y} ${this.end.x},${this.end.y}`;
    }

    get ctrlPoints() {
        const eps = 0.0001;
        this.bendRadius = typeof this.bendRadius === 'undefined' ? 1 : this.bendRadius;

        const dist = Math.sqrt(Math.pow(this.end.x - this.start.x, 2) + Math.pow(this.end.y - this.start.y, 2));
        const [dy, dx] = [this.end.y - this.start.y, this.end.x - this.start.x];
        let angleX;

        if (dx === 0 && dy >= 0) {
            angleX = Math.PI / 2;
        } else if (dx === 0 && dy < 0) {
            angleX = - Math.PI / 2;
        } else if (dx < 0) {
            angleX = Math.PI + Math.atan(dy/dx);
        } else {
            angleX = Math.atan(dy/dx);
        }

        const elongation = Math.min(dist / Math.max(this.length, eps), 1.0);

        // Calculate for horizontal hose first, rotate later
        const handleAngle = (1 - elongation)*Math.PI;
        const handleRadius = Math.sign(this.bendRadius)*(1 / Math.max(Math.abs(this.bendRadius), eps)) * this.length / 2;

        const ctrlStartOffset = rotatePoint({
            x: Math.abs(handleRadius) * Math.cos(-handleAngle),
            y: handleRadius * Math.sin(-handleAngle),
        }, angleX);

        const ctrlStart = {
            x: this.start.x + ctrlStartOffset.x,
            y: this.start.y + ctrlStartOffset.y,
        };

        const ctrlEndOffset = rotatePoint({
            x: Math.abs(handleRadius) * Math.cos(Math.PI + handleAngle),
            y: handleRadius * Math.sin(Math.PI + handleAngle),
        }, angleX);

        const ctrlEnd = {
            x: this.end.x + ctrlEndOffset.x,
            y: this.end.y + ctrlEndOffset.y,
        };

        return [ctrlStart, ctrlEnd];
    }
}

const rotatePoint = (point, angle) => {
    return {
        x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
        y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    };
};

const WalkCycle = withSizePositionAngle(_WalkCycle, 100, 100, true);

export default WalkCycle;
