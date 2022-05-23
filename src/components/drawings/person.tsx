import React from "react";
import _ from "lodash";
import { gsap } from "gsap";

import { RubberHose, RubberHoseModel, Point2D } from "./rubberHose";


export const DEFAULT_HEIGHT = 100;
export const DEFAULT_WIDTH = 100;

export const getSetHoseProp = (hoseRef, propName) => (newValue = null) => {
    const refs = Array.isArray(hoseRef) ? hoseRef : [hoseRef];
    if (newValue !== null) {
        refs.forEach(ref => ref.current?.[propName](newValue));
    }
    return refs[0].current?.[propName]();
};

export const createImperativePersonHandle = ({
    headRef,
    rArmRef1, rArmRef2,
    lArmRef1, lArmRef2,
    bodyRef,
    rLegRef1, rLegRef2,
    lLegRef1, lLegRef2,
    shouldersRef1, shouldersRef2
}) => () => ({
    headX: (newValue = null) => {
        getSetHoseProp(headRef, 'startX')(newValue);
        return getSetHoseProp(headRef, 'endX')(newValue);
    },
    headY: (newValue = null) => {
        getSetHoseProp(headRef, 'startY')(newValue);
        return getSetHoseProp(headRef, 'endY')(newValue);
    },
    headSize: getSetHoseProp(headRef, 'width'),
    armWidth: getSetHoseProp([rArmRef1, rArmRef2, lArmRef1, lArmRef2], 'width'),
    armLength: getSetHoseProp([rArmRef1, rArmRef2, lArmRef1, lArmRef2], 'length'),
    rArmBendFactor: getSetHoseProp([rArmRef1, rArmRef2], 'bendFactor'),
    lArmBendFactor: getSetHoseProp([lArmRef1, lArmRef2], 'bendFactor'),
    legWidth: getSetHoseProp([rLegRef1, rLegRef2, lLegRef1, lLegRef2], 'width'),
    legLength: getSetHoseProp([rLegRef1, rLegRef2, lLegRef1, lLegRef2], 'length'),
    lLegBendFactor: getSetHoseProp([lLegRef1, lLegRef2], 'bendFactor'),
    rLegBendFactor: getSetHoseProp([rLegRef1, rLegRef2], 'bendFactor'),
    rShoulderX: getSetHoseProp([rArmRef1, rArmRef2, shouldersRef1, shouldersRef2], 'startX'),
    rShoulderY: getSetHoseProp([rArmRef1, rArmRef2, shouldersRef1, shouldersRef2], 'startY'),
    rHandX: getSetHoseProp([rArmRef1, rArmRef2], 'endX'),
    rHandY: getSetHoseProp([rArmRef1, rArmRef2], 'endY'),
    lShoulderX: (value=null) => {
        getSetHoseProp([shouldersRef1, shouldersRef2], 'endX')(value);
        return getSetHoseProp([lArmRef1, lArmRef2], 'startX')(value);
    },
    lShoulderY: (value=null) => {
        getSetHoseProp([shouldersRef1, shouldersRef2], 'endY')(value);
        return getSetHoseProp([lArmRef1, lArmRef2], 'startY')(value);
    },
    lHandX: getSetHoseProp([lArmRef1, lArmRef2], 'endX'),
    lHandY: getSetHoseProp([lArmRef1, lArmRef2], 'endY'),
    bodyTopX: getSetHoseProp(bodyRef, 'startX'),
    bodyTopY: getSetHoseProp(bodyRef, 'startY'),
    bodyBottomX: getSetHoseProp(bodyRef, 'endX'),
    bodyBottomY: getSetHoseProp(bodyRef, 'endY'),
    bodyBendFactor: getSetHoseProp(bodyRef, 'bendFactor'),
    bodyWidth: getSetHoseProp(bodyRef, 'width'),
    bodyHeight: getSetHoseProp(bodyRef, 'length'),
    rHipX: getSetHoseProp([rLegRef1, rLegRef2], 'startX'),
    rHipY: getSetHoseProp([rLegRef1, rLegRef2], 'startY'),
    rFootX: getSetHoseProp([rLegRef1, rLegRef2], 'endX'),
    rFootY: getSetHoseProp([rLegRef1, rLegRef2], 'endY'),
    lHipX: getSetHoseProp([lLegRef1, lLegRef2], 'startX'),
    lHipY: getSetHoseProp([lLegRef1, lLegRef2], 'startY'),
    lFootX: getSetHoseProp([lLegRef1, lLegRef2], 'endX'),
    lFootY: getSetHoseProp([lLegRef1, lLegRef2], 'endY'),
    refs: {
        headRef: headRef,
        rArmRef1: rArmRef1,
        rArmRef2: rArmRef2,
        lArmRef1: lArmRef1,
        lArmRef2: lArmRef2,
        bodyRef: bodyRef,
        rLegRef1: rLegRef1,
        rLegRef2: rLegRef2,
        lLegRef1: lLegRef1,
        lLegRef2: lLegRef2,
        shouldersRef1: shouldersRef1,
        shouldersRef2: shouldersRef2,
    },
});


const _Person = ({ pose=null, color="#000000", outline="#efefef", isFront=false }, ref) => {
    const headRef = React.useRef();
    const rArmRef1 = React.useRef();
    const rArmRef2 = React.useRef();
    const lArmRef1 = React.useRef();
    const lArmRef2 = React.useRef();
    const bodyRef = React.useRef();
    const rLegRef1 = React.useRef();
    const rLegRef2 = React.useRef();
    const lLegRef1 = React.useRef();
    const lLegRef2 = React.useRef();
    const shouldersRef1 = React.useRef();
    const shouldersRef2 = React.useRef();

    pose = pose === null  ? getRestPose() : pose;

    React.useImperativeHandle(
        ref,
        createImperativePersonHandle({
            headRef: headRef,
            rArmRef1: rArmRef1,
            rArmRef2: rArmRef2,
            lArmRef1: lArmRef1,
            lArmRef2: lArmRef2,
            bodyRef: bodyRef,
            rLegRef1: rLegRef1,
            rLegRef2: rLegRef2,
            lLegRef1: lLegRef1,
            lLegRef2: lLegRef2,
            shouldersRef1: shouldersRef1,
            shouldersRef2: shouldersRef2,
        })
    );

    const armProps = {
        color: color,
        length: pose.armLength,
        width: pose.armWidth,
    };
    const rArmProps = {
        ...armProps,
        start: {
            x: pose.rShoulderX,
            y: pose.rShoulderY
        },
        end: {
            x: pose.rHandX,
            y: pose.rHandY
        },
        bendFactor: pose.rArmBendFactor,
    };
    const lArmProps = {
        ...armProps,
        start: {
            x: pose.lShoulderX,
            y: pose.lShoulderY
        },
        end: {
            x: pose.lHandX,
            y: pose.lHandY
        },
        bendFactor: pose.lArmBendFactor,
    };
    
    const shoulderProps = {
        color: color,
        length: 1.2*Math.abs(pose.lShoulderX - pose.rShoulderX),
        width: pose.armWidth,
        start: {
            x: pose.rShoulderX,
            y: pose.rShoulderY
        },
        end: {
            x: pose.lShoulderX,
            y: pose.lShoulderY
        },
        bendFactor: 0.5,
    };

    const legProps = {
        color: color,
        length: pose.legLength,
        width: pose.legWidth,
    };
    const rLegProps = {
        ...legProps,
        start: {
            x: pose.rHipX,
            y: pose.rHipY
        },
        end: {
            x: pose.rFootX,
            y: pose.rFootY
        },
        bendFactor: pose.rLegBendFactor,
    };
    const lLegProps = {
        ...legProps,
        start: {
            x: pose.lHipX,
            y: pose.lHipY,
        },
        end: {
            x: pose.lFootX,
            y: pose.lFootY
        },
        bendFactor: pose.lLegBendFactor,
    };

    const headProps = {
        color: color,
        length: 0,
        width: pose.headSize,
        start: {
            x: pose.headX,
            y: pose.headY,
        },
        end: {
            x: pose.headX,
            y: pose.headY
        },
        bendFactor: 1,
    };

    const bodyProps = {
        color: color,
        length: pose.bodyHeight,
        width: pose.bodyWidth,
        start: {
            x: pose.bodyTopX,
            y: pose.bodyTopY,
        },
        end: {
            x: pose.bodyBottomX,
            y: pose.bodyBottomY
        },
        bendFactor: pose.bodyBendFactor,
    };

    const head = <RubberHose {...headProps} ref={headRef} outline={outline} />;
    const rArm1 = <RubberHose {...rArmProps} ref={rArmRef1} outline={outline} />;
    const rArm2 = <RubberHose {...rArmProps} ref={rArmRef2} outline={null} />;
    const lArm1 = <RubberHose {...lArmProps} ref={lArmRef1} outline={outline} />;
    const lArm2 = <RubberHose {...lArmProps} ref={lArmRef2} outline={null} />;
    const body = <RubberHose {...bodyProps} ref={bodyRef} outline={outline} />;
    const rLeg1 = <RubberHose {...rLegProps} ref={rLegRef1} outline={outline} />;
    const rLeg2 = <RubberHose {...rLegProps} ref={rLegRef2} outline={null} />;
    const lLeg1 = <RubberHose {...lLegProps} ref={lLegRef1} outline={outline} />;
    const lLeg2 = <RubberHose {...lLegProps} ref={lLegRef2} outline={null} />;
    const shoulders1 = <RubberHose {...shoulderProps} ref={shouldersRef1} outline={outline} />;
    const shoulders2 = <RubberHose {...shoulderProps} ref={shouldersRef2} outline={null} />;

    const limbs = isFront ? [
        rLeg1, lLeg1,
        shoulders1,
        body,
        head,
        rLeg2, lLeg2,
        lArm1, lArm2,
        rArm1, rArm2,
        shoulders2,
    ] : [
        lArm1, lArm2,
        lLeg1, lLeg2,
        rLeg1,
        shoulders1,
        body,
        head,
        shoulders2,
        rLeg2,
        rArm1, rArm2,
    ];

    return (
        <g>
          { limbs.map((limb, idx) => <React.Fragment key={idx}>{limb}</React.Fragment>) }
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
    rArmBendFactor: number,
    lArmBendFactor: number,
    bodyTopX: number,
    bodyTopY: number,
    bodyBottomX: number,
    bodyBottomY: number,
    bodyWidth: number,
    bodyHeight: number,
    bodyBendFactor: number,
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
    lLegBendFactor: number,
    rLegBendFactor: number,
}


export const getRestPose = ({
    headSize=18,
    armWidth=8, armLength=38, armBendFactor=-0.5,
    legWidth=10, legLength=54, legBendFactor=0.5,
    bodyWidth=17, bodyHeight=27, bodyBendFactor=-0.5,
}={}) => {
    const rFoot = {
        x: 50,
        y: DEFAULT_HEIGHT - legWidth/2
    };
    const headPoint = {
        x: 61,
        y: 0 + headSize/2,
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
        rArmBendFactor: armBendFactor,
        lArmBendFactor: armBendFactor,
        bodyTopX: torso.x,
        bodyTopY: torso.y,
        bodyBottomX: bottom.x,
        bodyBottomY: bottom.y,
        bodyWidth: bodyWidth,
        bodyHeight: bodyHeight,
        bodyBendFactor: bodyBendFactor,
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
        lLegBendFactor: legBendFactor,
        rLegBendFactor: legBendFactor,
    };
};

export const getRestPoseFront = ({
    headSize=18,
    armWidth=7, armLength=33, armBendFactor=0.5, shoulderOffset=12.5, handOffset=15,
    legWidth=9.5, legLength=48, legBendFactor=0.5,
    bodyWidth=20, bodyHeight=35, bodyBendFactor=0,
}={}) => {
    const hipOffset = (bodyWidth - legWidth)/2;

    const headPoint = {
        x: 50,
        y: 0 + headSize/2,
    };

    const rFoot = {
        x: headPoint.x - hipOffset,
        y: DEFAULT_HEIGHT - legWidth/2
    };
    const lFoot = {
        ...rFoot,
        x: headPoint.x + hipOffset,
    };

    const rHip = {
        x: headPoint.x - hipOffset,
        y: rFoot.y - legLength
    };
    const lHip = {
        ...rHip,
        x: headPoint.x + hipOffset,
    };
    const bottom = {
        x: headPoint.x,
        y: rHip.y,
    };
    const torso = {
        x: headPoint.x,
        y: bottom.y - bodyHeight + bodyWidth
    };
    const rShoulder = {
        x: torso.x - shoulderOffset,
        y: torso.y - bodyWidth/2 + armWidth/2,
    };
    const lShoulder = {
        ...rShoulder,
        x: torso.x + shoulderOffset,
    };

    const rHand = {
        x: headPoint.x - handOffset,
        y: rShoulder.y + armLength * 0.9
    };
    const lHand = {
        ...rHand,
        x: headPoint.x + handOffset,
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
        rArmBendFactor: - armBendFactor,
        lArmBendFactor: armBendFactor,
        bodyTopX: torso.x,
        bodyTopY: torso.y,
        bodyBottomX: bottom.x,
        bodyBottomY: bottom.y,
        bodyWidth: bodyWidth,
        bodyHeight: bodyHeight,
        bodyBendFactor: bodyBendFactor,
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
        rLegBendFactor: - legBendFactor,
        lLegBendFactor: legBendFactor,
    };
};
