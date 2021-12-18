import React from "react";
import _ from "lodash";
import { gsap } from "gsap";

import { RubberHose, RubberHoseModel, Point2D } from "./rubber_hose";
import { DrawingContext } from "components/shortcodes/drawing";


export const getSetHoseProp = (hoseRef, propName) => (newValue = null) => {
    if (newValue !== null) {
        hoseRef.current?.[propName](newValue);
    }
    return hoseRef.current?.[propName]();
};

export const createImperativePersonHandle = (
    headRef, rArmRef, lArmRef, bodyRef,
    rLegRef1, rLegRef2, lLegRef
) => () => ({
    headX: (newValue = null) => {
        getSetHoseProp(headRef, 'startX')(newValue);
        return getSetHoseProp(headRef, 'endX')(newValue);
    },
    headY: (newValue = null) => {
        getSetHoseProp(headRef, 'startY')(newValue);
        return getSetHoseProp(headRef, 'endY')(newValue);
    },
    headSize: getSetHoseProp(headRef, 'width'),
    armWidth: (newValue = null) => {
        getSetHoseProp(rArmRef, 'width')(newValue);
        return getSetHoseProp(lArmRef, 'width')(newValue);
    },
    armLength: (newValue = null) => {
        getSetHoseProp(rArmRef, 'length')(newValue);
        return getSetHoseProp(lArmRef, 'length')(newValue);
    },
    armBendRadius: (newValue = null) => {
        getSetHoseProp(rArmRef, 'bendRadius')(newValue);
        return getSetHoseProp(lArmRef, 'bendRadius')(newValue);
    },
    legWidth: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'width')(newValue);
        getSetHoseProp(rLegRef2, 'width')(newValue);
        return getSetHoseProp(lLegRef, 'width')(newValue);
    },
    legLength: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'length')(newValue);
        getSetHoseProp(rLegRef2, 'length')(newValue);
        return getSetHoseProp(lLegRef, 'length')(newValue);
    },
    legBendRadius: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'bendRadius')(newValue);
        getSetHoseProp(rLegRef2, 'bendRadius')(newValue);
        return getSetHoseProp(lLegRef, 'bendRadius')(newValue);
    },
    rShoulderX: getSetHoseProp(rArmRef, 'startX'),
    rShoulderY: getSetHoseProp(rArmRef, 'startY'),
    rHandX: getSetHoseProp(rArmRef, 'endX'),
    rHandY: getSetHoseProp(rArmRef, 'endY'),
    lShoulderX: getSetHoseProp(lArmRef, 'startX'),
    lShoulderY: getSetHoseProp(lArmRef, 'startY'),
    lHandX: getSetHoseProp(lArmRef, 'endX'),
    lHandY: getSetHoseProp(lArmRef, 'endY'),
    bodyTopX: getSetHoseProp(bodyRef, 'startX'),
    bodyTopY: getSetHoseProp(bodyRef, 'startY'),
    bodyBottomX: getSetHoseProp(bodyRef, 'endX'),
    bodyBottomY: getSetHoseProp(bodyRef, 'endY'),
    bodyBendRadius: getSetHoseProp(bodyRef, 'bendRadius'),
    bodyWidth: getSetHoseProp(bodyRef, 'width'),
    bodyHeight: getSetHoseProp(bodyRef, 'length'),
    rHipX: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'startX')(newValue);
        return getSetHoseProp(rLegRef2, 'startX')(newValue);
    }, 
    rHipY: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'startY')(newValue);
        return getSetHoseProp(rLegRef2, 'startY')(newValue);
    },
    rFootX: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'endX')(newValue);
        return getSetHoseProp(rLegRef2, 'endX')(newValue);
    },
    rFootY: (newValue = null) => {
        getSetHoseProp(rLegRef1, 'endY')(newValue);
        return getSetHoseProp(rLegRef2, 'endY')(newValue);
    },
    lHipX: getSetHoseProp(lLegRef, 'startX'),
    lHipY: getSetHoseProp(lLegRef, 'startY'),
    lFootX: getSetHoseProp(lLegRef, 'endX'),
    lFootY: getSetHoseProp(lLegRef, 'endY'),
});


const _Person = ({ pose=null, limbRefs={}, color="#000000", outline="#efefef" }, ref) => {
    const lLegRef = limbRefs.lLegRef || React.useRef();
    const lArmRef = limbRefs.lArmRef || React.useRef();
    const rLegRef1 = limbRefs.rLegRef1 || React.useRef();
    const rLegRef2 = limbRefs.rLegRef2 || React.useRef();
    const rArmRef = limbRefs.rArmRef || React.useRef();
    const headRef = limbRefs.headRef || React.useRef();
    const bodyRef = limbRefs.bodyRef || React.useRef();

    pose = pose === null  ? getRestPose() : pose;

    React.useImperativeHandle(
        ref,
        createImperativePersonHandle(
            headRef, rArmRef, lArmRef, bodyRef,
            rLegRef1, rLegRef2, lLegRef
        )
    );

    return (
        <g>
          <RubberHose ref={lArmRef} color={color} outline={outline}
              start={{x: pose.lShoulderX, y: pose.lShoulderY}}
              end={{x: pose.lHandX, y: pose.lHandY}}
              width={pose.armWidth}
              bendRadius={pose.armBendRadius}
              length={pose.armLength} />
          <RubberHose ref={lLegRef} color={color} outline={outline}
              start={{x: pose.lHipX, y: pose.lHipY}}
              end={{x: pose.lFootX, y: pose.lFootY}}
              width={pose.legWidth}
              bendRadius={pose.legBendRadius}
              length={pose.legLength} />
          <RubberHose ref={rLegRef1} color={color} outline={outline}
              start={{x: pose.rHipX, y: pose.rHipY}}
              end={{x: pose.rFootX, y: pose.rFootY}}
              width={pose.legWidth}
              bendRadius={pose.legBendRadius}
              length={pose.legLength} />
          <RubberHose ref={headRef} color={color} outline={outline}
              start={{x: pose.headX, y: pose.headY}}
              end={{x: pose.headX, y: pose.headY}}
              width={pose.headSize}
              bendRadius={1}
              length={0} />
          <RubberHose ref={bodyRef} color={color} outline={outline}
              start={{x: pose.bodyTopX, y: pose.bodyTopY}}
              end={{x: pose.bodyBottomX, y: pose.bodyBottomY}}
              width={pose.bodyWidth}
              bendRadius={pose.bodyBendRadius}
              length={pose.bodyHeight} />
          <RubberHose ref={rLegRef2} color={color} outline={null}
              start={{x: pose.rHipX, y: pose.rHipY}}
              end={{x: pose.rFootX, y: pose.rFootY}}
              width={pose.legWidth}
              bendRadius={pose.legBendRadius}
              length={pose.legLength} />
          <RubberHose ref={rArmRef} color={color} outline={outline}
              start={{x: pose.rShoulderX, y: pose.rShoulderY}}
              end={{x: pose.rHandX, y: pose.rHandY}}
              width={pose.armWidth}
              bendRadius={pose.armBendRadius}
              length={pose.armLength} />
        </g>
    );
};

export const Person = React.forwardRef(_Person);

export type PoseType = {
    headSize: number,
    headX: number,
    headY: number,
    rShoulderX: number,
    rShoulderY: number,
    rHandX: number,
    rHandY: number,
    lShoulderX: number,
    lShoulderY: number,
    lHandX: number,
    lHandY: number,
    armWidth: number,
    armLength: number,
    armBendRadius: number,
    bodyTopX: number,
    bodyTopY: number,
    bodyBottomX: number,
    bodyBottomY: number,
    bodyWidth: number,
    bodyHeight: number,
    bodyBendRadius: number,
    rHipX: number,
    rHipY: number,
    rFootX: number,
    rFootY: number,
    lHipX: number,
    lHipY: number,
    lFootX: number,
    lFootY: number,
    legWidth: number,
    legLength: number,
    legBendRadius: number,
}

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

    return {
        headSize: headSize,
        headX: headPoint.x,
        headY: headPoint.y,
        rShoulderX: rShoulder.x,
        rShoulderY: rShoulder.y,
        rHandX: rHand.x,
        rHandY: rHand.y,
        lShoulderX: lShoulder.x,
        lShoulderY: lShoulder.y,
        lHandX: lHand.x,
        lHandY: lHand.y,
        armWidth: armWidth,
        armLength: armLength,
        armBendRadius: armBendRadius,
        bodyTopX: torso.x,
        bodyTopY: torso.y,
        bodyBottomX: bottom.x,
        bodyBottomY: bottom.y,
        bodyWidth: bodyWidth,
        bodyHeight: bodyHeight,
        bodyBendRadius: bodyBendRadius,
        rHipX: rHip.x,
        rHipY: rHip.y,
        rFootX: rFoot.x,
        rFootY: rFoot.y,
        lHipX: lHip.x,
        lHipY: lHip.y,
        lFootX: lFoot.x,
        lFootY: lFoot.y,
        legWidth: legWidth,
        legLength: legLength,
        legBendRadius: legBendRadius,
  };
};