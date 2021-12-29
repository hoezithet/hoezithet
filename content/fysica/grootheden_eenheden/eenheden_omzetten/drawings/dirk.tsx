import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import {
    Person, getRestPose, getRestPoseFront, getSetHoseProp,
    createImperativePersonHandle
} from "components/drawings/person";
import { RubberHose } from "components/drawings/rubberHose";
import { withBreathing } from "./breathingPerson";
import { gsap } from "gsap";


const _DirkTrui = ({ isFront=false }) => {
    return (
        <g transform="translate(-41.998138 -38.749356)">
          <defs>
            <pattern patternUnits="userSpaceOnUse" width="50.260043" height="37.694409" patternTransform="" id="pattern11803">
              <g id="use13498-9-3" transform="matrix(3.7795279,0,0,3.7795279,-77.89009,-234.54449)">
                <rect id="rect13530-9-3" y="62.056557" x="20.608419" height="9.9733095" width="13.297967" fill="none" stroke="none" strokeWidth="0.61472619"/>
                <path d="m 30.581893,62.056559 3.324491,4.986654 -3.324491,4.986654 -3.32449,-4.986654 z m -6.648981,10e-7 3.32449,4.986654 -3.32449,4.986654 -3.32449,-4.986654 z" opacity="1" fill="#555555" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13532-2-5"/>
                <path d="m 27.257404,62.05656 3.324489,-10e-7 -3.32449,4.986654 -3.324491,-4.986654 z m -1e-6,4.986654 3.32449,4.986654 -3.324489,-2e-6 -3.324492,2e-6 z" opacity="1" fill="#16502d" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13534-3-0"/>
                <path d="m 33.906385,67.043213 v 4.986653 0 l -3.324491,10e-7 z m -13.297963,1e-6 3.32449,4.986654 -3.324489,-2e-6 z m 10e-7,-4.986654 3.32449,-2e-6 -3.32449,4.986655 z m 13.297962,0 v 0 l -10e-7,4.986653 -3.32449,-4.986655 z" opacity="1" fill="#19a974" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600653, 2.65600653" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" id="path13536-5-1"/>
                <path id="path13538-4-4" opacity="1" fill="#137752" fillOpacity="1" stroke="#000000" strokeWidth="0.21277149" strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="4" strokeDasharray="0.2127715, 0.42554299" strokeDashoffset="0" strokeOpacity="1" d="m 27.257401,71.922222 -6.541749,-9.758016 m 13.083499,9.758016 -6.541748,-9.758017 m 0,9.758017 6.541748,-9.758017 m -13.083499,9.758017 6.54175,-9.758017" />
              </g>
            </pattern>
          </defs>
          <path fill="url(#pattern11803)" fillOpacity="1"
              transform={ isFront ? "translate(60,61.5) rotate(0) scale(-0.15,0.15)"
                          : "translate(58.9,72.2) rotate(5) scale(-0.20,0.20)" }
              d={ isFront ? "m 0,0 c -18.9822,-43.1317 -0.09,-80.3893 -0.1356,-116.5839 6.2982,-13.0449 12.6622,-21.1976 7.6213,-42.8449 25.9282,-7.0777 57.9779,-5.9432 83.0308,0 -0.7689,12.9479 -0.2794,27.0303 7.6706,42.4524 0.1119,36.0016 20.4714,77.2176 -0.1878,116.9764 -33.7271,9.9757 -63.5651,8.6738 -97.9993,0 z"
                 : "m 0,0 c -8.1837,-9.1 -23.3311,-30.3332 -12.9133,-64.3306 15.0395,-49.07961 18.3508,-67.80085 20.8985,-77.89896 4.2916,-17.01078 34.1766,-29.64427 54.0249,-16.0162 34.8602,24.23418 32.2555,110.64066 18.4074,161.46876 -55.4933,14.0721 -68.6676,9.8429 -80.4178,-3.223 z" }/>
        </g>
    );
};

const DirkTrui = withSizePositionAngle(_DirkTrui, 20.961890, 35.384704);

const _Dirk = ({pose=null, color="#000000", outline="#efefef", isFront=false}, ref) => {
    pose = pose === null  ? (isFront ? getRestPoseFront() : getRestPose()) : pose;
    const hipShoulderDist = Math.abs(pose.rShoulderY - pose.rHipY);
    const sweaterHeight = pose.bodyHeight + pose.bodyWidth;
    const personRef = React.useRef(null);
    const sweaterRef = React.useRef(null);
    const rArmRefTop = React.useRef(null);
    const lArmRefTop = React.useRef(null);

    React.useEffect(() => {
        const limbRefs = personRef.current?.refs;
        limbRefs.bodyRef.current.opacity(0);
    }, []);

    React.useImperativeHandle(ref, () => {
        const limbRefs = personRef.current?.refs;
        const impHandle = createImperativePersonHandle(limbRefs);
        return {
            ...impHandle(),
            rShoulderX: (newValue = null) => {
                if (newValue !== null && sweaterRef.current) {
                    gsap.set(sweaterRef.current, {x: newValue - pose.rShoulderX});
                }
                getSetHoseProp(rArmRefTop, 'startX')(newValue);
                return impHandle().rShoulderX(newValue);
            },
            rShoulderY: (newValue = null) => {
                if (newValue !== null && sweaterRef.current) {
                    const newSweaterHeight = sweaterHeight - (newValue - pose.rShoulderY);
                    const scaleY = newSweaterHeight/sweaterHeight;
                    gsap.set(sweaterRef.current, {scaleY: scaleY, transformOrigin: "center bottom"});
                }
                getSetHoseProp(rArmRefTop, 'startY')(newValue);
                return impHandle().rShoulderY(newValue);
            },
            lShoulderX: (newValue = null) => {
                getSetHoseProp(lArmRefTop, 'startX')(newValue);
                return impHandle().lShoulderX(newValue);
            },
            lShoulderY: (newValue = null) => {
                getSetHoseProp(lArmRefTop, 'startY')(newValue);
                return impHandle().lShoulderY(newValue);
            },
            rHandX: (newValue = null) => {
                getSetHoseProp(rArmRefTop, 'endX')(newValue);
                return impHandle().rHandX(newValue);
            },
            rHandY: (newValue = null) => {
                getSetHoseProp(rArmRefTop, 'endY')(newValue);
                return impHandle().rHandY(newValue);
            },
            lHandX: (newValue = null) => {
                getSetHoseProp(lArmRefTop, 'endX')(newValue);
                return impHandle().lHandX(newValue);
            },
            lHandY: (newValue = null) => {
                getSetHoseProp(lArmRefTop, 'endY')(newValue);
                return impHandle().lHandY(newValue);
            },
        }
    });

    const rArm = (
        <RubberHose ref={rArmRefTop} color={color} outline={isFront ? null : outline}
            start={{x: pose.rShoulderX, y: pose.rShoulderY}}
            end={{x: pose.rHandX, y: pose.rHandY}}
            width={pose.armWidth}
            bendRadius={pose.rArmBendRadius}
            length={pose.armLength} />
    );

    const lArm = (
        <RubberHose ref={lArmRefTop} color={color} outline={null}
            start={{x: pose.lShoulderX, y: pose.lShoulderY}}
            end={{x: pose.lHandX, y: pose.lHandY}}
            width={pose.armWidth}
            bendRadius={pose.lArmBendRadius}
            length={pose.armLength} />
    );

    return (
        <g>
          <g>
            <Person ref={personRef} pose={pose} color={color} outline={outline} isFront={isFront}/>
            { lArm }
            { isFront ?  rArm : null }
            <g ref={sweaterRef}>
              <DirkTrui height={sweaterHeight} x={pose.bodyTopX} y={pose.bodyTopY - pose.bodyWidth/2} hAlign="center" isFront={isFront} ignoreDrawingContext />
            </g>
            { isFront ?  null : rArm }
          </g>
        </g>
    );
}

const Dirk = React.forwardRef(_Dirk);
export const BreathingDirk = withSizePositionAngle(withBreathing(Dirk), 100, 100);

export default withSizePositionAngle(Dirk, 100, 100);
