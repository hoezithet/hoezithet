import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import {
    Person, getRestPose, getSetHoseProp,
    createImperativePersonHandle
} from "components/drawings/person";
import { RubberHose } from "components/drawings/rubber_hose";
import { withBreathing } from "./breathingPerson";
import { gsap } from "gsap";


const _DirkTrui = () => {
    return (
        <g transform="translate(-41.998138 -38.749356)">
          <defs>
            <pattern xlinkHref="#pattern13509-8" patternTransform="matrix(1.1414159,-0.11897132,0.17078581,1.6385267,1350.192,1652.2009)" id="pattern11803"/>
            <pattern xlinkHref="#pattern13500-6-7" patternTransform="matrix(-0.08765214,0,0,0.1258265,79.205005,64.390907)" id="pattern13509-8"/>
            <pattern patternUnits="userSpaceOnUse" width="50.260043" height="37.694409" patternTransform="matrix(0.26458331,0,0,0.26458331,39.526125,62.056557)" id="pattern13500-6-7">
              <g id="use13498-9-3" transform="matrix(3.7795279,0,0,3.7795279,-77.89009,-234.54449)">
                <rect id="rect13530-9-3" y="62.056557" x="20.608419" height="9.9733095" width="13.297967" fill="none" stroke="none" strokeWidth="0.61472619"/>
                <path d="m 30.581893,62.056559 3.324491,4.986654 -3.324491,4.986654 -3.32449,-4.986654 z m -6.648981,10e-7 3.32449,4.986654 -3.32449,4.986654 -3.32449,-4.986654 z" opacity="1" fill="#555555" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13532-2-5"/>
                <path d="m 27.257404,62.05656 3.324489,-10e-7 -3.32449,4.986654 -3.324491,-4.986654 z m -1e-6,4.986654 3.32449,4.986654 -3.324489,-2e-6 -3.324492,2e-6 z" opacity="1" fill="#16502d" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13534-3-0"/>
                <path d="m 33.906385,67.043213 v 4.986653 0 l -3.324491,10e-7 z m -13.297963,1e-6 3.32449,4.986654 -3.324489,-2e-6 z m 10e-7,-4.986654 3.32449,-2e-6 -3.32449,4.986655 z m 13.297962,0 v 0 l -10e-7,4.986653 -3.32449,-4.986655 z" opacity="1" fill="#19a974" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600653, 2.65600653" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13536-5-1"/>
                <path id="path13538-4-4" opacity="1" fill="#137752" fillOpacity="1" stroke="#000000" strokeWidth="0.21277149" strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="4" strokeDasharray="0.2127715, 0.42554299" strokeDashoffset="0" strokeOpacity="1" d="m 27.257401,71.922222 -6.541749,-9.758016 m 13.083499,9.758016 -6.541748,-9.758017 m 0,9.758017 6.541748,-9.758017 m -13.083499,9.758017 6.54175,-9.758017" />
              </g>
            </pattern>
          </defs>
          <path fill="url(#pattern11803)" fillOpacity="1" transform="translate(58.9,72.2) rotate(5) scale(-0.20,0.20)" d="m 0,0 c -8.1837,-9.1 -23.3311,-30.3332 -12.9133,-64.3306 15.0395,-49.07961 18.3508,-67.80085 20.8985,-77.89896 4.2916,-17.01078 34.1766,-29.64427 54.0249,-16.0162 34.8602,24.23418 32.2555,110.64066 18.4074,161.46876 -55.4933,14.0721 -68.6676,9.8429 -80.4178,-3.223 z" />
        </g>
    );
};

const DirkTrui = withSizePositionAngle(_DirkTrui, 20.961890, 35.384704);

const _DirkZij = ({pose=null, color="#000000", outline="#efefef"}, ref) => {
    const lLegRef = React.useRef();
    const lArmRef = React.useRef();
    const rLegRef1 = React.useRef();
    const rLegRef2 = React.useRef();
    const rArmRef1 = React.useRef();
    const rArmRef2 = React.useRef();
    const headRef = React.useRef();
    const bodyRef = React.useRef();
    const sweaterRef = React.useRef();

    pose = pose === null  ? getRestPose() : pose;
    const hipShoulderDist = Math.abs(pose.rShoulderY - pose.rHipY);
    const sweaterHeight = pose.bodyHeight + pose.bodyWidth;
    
    const limbRefs = {
        headRef: headRef, rArmRef: rArmRef1, lArmRef: lArmRef,
        bodyRef: bodyRef, rLegRef1: rLegRef1, rLegRef2: rLegRef2,
        lLegRef: lLegRef,
    };
    const impHandle = createImperativePersonHandle(
        headRef, rArmRef1, lArmRef, bodyRef,
        rLegRef1, rLegRef2, lLegRef
    );
    React.useEffect(() => {
        bodyRef.current.opacity(0);
    }, []);
    
    React.useImperativeHandle(ref, () => ({
        ...impHandle(),
        rShoulderX: (newValue = null) => {
            if (newValue !== null && sweaterRef.current) {
                gsap.set(sweaterRef.current, {x: newValue - pose.rShoulderX});
            }
            getSetHoseProp(rArmRef1, 'startX')(newValue);
            return getSetHoseProp(rArmRef2, 'startX')(newValue);
        },
        rShoulderY: (newValue = null) => {
            if (newValue !== null && sweaterRef.current) {
                const newSweaterHeight = sweaterHeight - (newValue - pose.rShoulderY);
                const scaleY = newSweaterHeight/sweaterHeight;
                gsap.set(sweaterRef.current, {scaleY: scaleY, transformOrigin: "center bottom"});
            }
            getSetHoseProp(rArmRef1, 'startY')(newValue);
            return getSetHoseProp(rArmRef2, 'startY')(newValue);
        },
        rHandX: (newValue = null) => {
            getSetHoseProp(rArmRef1, 'endX')(newValue);
            return getSetHoseProp(rArmRef2, 'endX')(newValue);
        },
        rHandY: (newValue = null) => {
            getSetHoseProp(rArmRef1, 'endY')(newValue);
            return getSetHoseProp(rArmRef2, 'endY')(newValue);
        }
    }));

    return (
        <g>
          <g>
            <Person limbRefs={limbRefs} pose={pose} color={color} outline={outline} />
            <g ref={sweaterRef}>
              <DirkTrui height={sweaterHeight} x={pose.bodyTopX} y={pose.bodyTopY - pose.bodyWidth/2} hAlign="center" ignoreDrawingContext />
            </g>
            <RubberHose ref={rArmRef2} color={color} outline={outline}
              start={{x: pose.rShoulderX, y: pose.rShoulderY}}
              end={{x: pose.rHandX, y: pose.rHandY}}
              width={pose.armWidth}
              bendRadius={pose.armBendRadius}
              length={pose.armLength} />
          </g>
        </g>
    );
}

const DirkZij = React.forwardRef(_DirkZij);
export const BreathingDirkZij = withSizePositionAngle(withBreathing(DirkZij), 100, 100);

export default withSizePositionAngle(DirkZij, 100, 100);
