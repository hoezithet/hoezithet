import React from "react";
import _ from "lodash";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

import { RubberHose, RubberHoseModel } from "./rubber_hose";

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

export const Person = React.forwardRef(_Person);

export const getRestPose = (headSize=14, armWidth=6, armLength=30, armBendRadius=-2.0, legWidth=8, legLength=40, legBendRadius=2.0, bodyWidth=13, bodyHeight=20, bodyBendRadius=-2.0) => {
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

export const AnimatedPerson = ({ poseKeypoints, color="#000000", outline="#efefef" }) => {
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
