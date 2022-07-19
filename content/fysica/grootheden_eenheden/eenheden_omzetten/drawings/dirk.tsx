import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import {
    Person, getRestPose, getRestPoseFront, getSetHoseProp,
    createImperativePersonHandle
} from "components/drawings/person";
import { RubberHose } from "components/drawings/rubberHose";
import { withBreathing } from "./breathingPerson";
import { gsap } from "gsap";
import _flatten from "lodash/flatten";
import _range from "lodash/range";
import useId from 'hooks/useId';


const [TRUI_WIDTH, TRUI_HEIGHT] = [20.961890, 35.384704];
const TRUI_SHOULDER = {x: TRUI_WIDTH*0.5, y: TRUI_HEIGHT*0.2};
const TRUI_HIP = {x: TRUI_WIDTH*0.5, y: TRUI_HEIGHT*0.85};

const matmul = (A, B) => A.map((row, i) => B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0)));
const norm = vec => Math.sqrt(_flatten(vec).reduce((acc, x) => acc + Math.pow(x, 2), 0));
const transp = A => A[0].map((_, j) => A.map(row => row[j]));


const get1DStretchMatrix = (
    p1, p2,
    p1_new, p2_new,
) => {
    const V = [
        [p2.x - p1.x, p2.y - p1.y],
        [p2.y - p1.y, p1.x - p2.x]
    ];
    const detV = V[0][0]*V[1][1] - V[0][1]*V[1][0];
    const Vinv = [
        [V[0][0]/detV,  V[1][0]/detV],
        [V[0][1]/detV, -V[1][1]/detV]
    ];

    const scale = norm([[p2_new.x - p1_new.x], [p2_new.y - p1_new.y]])/norm([[p2.x - p1.x], [p2.y - p1.y]]);
    const D = [
        [scale, 0],
        [    0, 1]
    ];

    return matmul(V, matmul(D, Vinv));
};


const get1DStretchSizePosAngle = (
    p1, p2, width, height,
    p1_new, p2_new,
) => {
    const mat = get1DStretchMatrix(p1, p2, p1_new, p2_new);
    const topLeft = matmul(mat, [[p1.x], [p1.y]]);

    return {
        x: p1_new.x + topLeft[0][0],
        y: p1_new.y + topLeft[1][0],
        width: norm(matmul(mat, [[width], [0]])),
        height: norm(matmul(mat, [[0], [height]])),
        angle: (
            Math.atan2(p2_new.y - p1_new.y, p2_new.x - p1_new.x)
            - Math.atan2(p2.y - p1.y, p2.x - p1.x)
        ) *180/Math.PI,
        angleAnchorRelX: p1.x/width,
        angleAnchorRelY: p1.y/height,
    };
};


const _DirkTrui = ({ isFront=false }) => {
    const patternId = useId();

    return (
        <>
        <g transform="translate(-41.998138 -38.749356)">
          <defs>
            <pattern patternUnits="userSpaceOnUse" width="50.260043" height="37.694409" patternTransform="" id={patternId}>
              <g transform="matrix(3.7795279,0,0,3.7795279,-77.89009,-234.54449)">
                <rect y="62.056557" x="20.608419" height="9.9733095" width="13.297967" fill="none" stroke="none" strokeWidth="0.61472619"/>
                <path d="m 30.581893,62.056559 3.324491,4.986654 -3.324491,4.986654 -3.32449,-4.986654 z m -6.648981,10e-7 3.32449,4.986654 -3.32449,4.986654 -3.32449,-4.986654 z" opacity="1" fill="#555555" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" />
                <path d="m 27.257404,62.05656 3.324489,-10e-7 -3.32449,4.986654 -3.324491,-4.986654 z m -1e-6,4.986654 3.32449,4.986654 -3.324489,-2e-6 -3.324492,2e-6 z" opacity="1" fill="#16502d" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600656, 2.65600656" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill" />
                <path d="m 33.906385,67.043213 v 4.986653 0 l -3.324491,10e-7 z m -13.297963,1e-6 3.32449,4.986654 -3.324489,-2e-6 z m 10e-7,-4.986654 3.32449,-2e-6 -3.32449,4.986655 z m 13.297962,0 v 0 l -10e-7,4.986653 -3.32449,-4.986655 z" opacity="1" fill="#19a974" fillOpacity="1" stroke="none" strokeWidth="0.88533551" strokeLinecap="butt" strokeLinejoin="bevel" strokeMiterlimit="4" strokeDasharray="2.65600653, 2.65600653" strokeDashoffset="0" strokeOpacity="1" paintOrder="markers stroke fill"/>
                <path opacity="1" fill="#137752" fillOpacity="1" stroke="#000000" strokeWidth="0.21277149" strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="4" strokeDasharray="0.2127715, 0.42554299" strokeDashoffset="0" strokeOpacity="1" d="m 27.257401,71.922222 -6.541749,-9.758016 m 13.083499,9.758016 -6.541748,-9.758017 m 0,9.758017 6.541748,-9.758017 m -13.083499,9.758017 6.54175,-9.758017" />
              </g>
            </pattern>
          </defs>
          { isFront ?
            <path fill={patternId ? `url(#${patternId})` : null} fillOpacity="1"
              transform="translate(63.3,78) rotate(0) scale(-0.22,0.24)"
              d="m 0,0 c -18.9822,-43.1317 -0.09,-80.3893 -0.1356,-116.5839 6.2982,-13.0449 12.6622,-21.1976 7.6213,-42.8449 25.9282,-7.0777 57.9779,-5.9432 83.0308,0 -0.7689,12.9479 -0.2794,27.0303 7.6706,42.4524 0.1119,36.0016 20.4714,77.2176 -0.1878,116.9764 -33.7271,9.9757 -63.5651,8.6738 -97.9993,0 z"/>
            :
            <path fill={patternId ? `url(#${patternId})` : null} fillOpacity="1"
              transform="translate(58.9,72.2) rotate(5) scale(-0.20,0.20)"
              d="m 0,0 c -8.1837,-9.1 -23.3311,-30.3332 -12.9133,-64.3306 15.0395,-49.07961 18.3508,-67.80085 20.8985,-77.89896 4.2916,-17.01078 34.1766,-29.64427 54.0249,-16.0162 34.8602,24.23418 32.2555,110.64066 18.4074,161.46876 -55.4933,14.0721 -68.6676,9.8429 -80.4178,-3.223 z"/>
          }
        </g>
        </>
    );
};

const DirkTrui = withSizePositionAngle(_DirkTrui, TRUI_WIDTH, TRUI_HEIGHT);

const getMidPoint = (p1, p2) => {
    const width = p1.x - p2.x;
    const midX = p2.x + width/2;
    const height = p1.y - p2.y;
    const midY = p2.y + height/2;

    return {
        x: midX,
        y: midY
    };
};

const getShoulderMid = (pose) => {
    return getMidPoint({
        x: pose.rShoulderX,
        y: pose.rShoulderY,
    }, {
        x: pose.lShoulderX,
        y: pose.lShoulderY,
    });
};


const getHipMid = (pose) => {
    return getMidPoint({
        x: pose.rHipX,
        y: pose.rHipY,
    }, {
        x: pose.lHipX,
        y: pose.lHipY,
    });
};

const _Dirk = ({pose=null, color="#000000", outline="#efefef", isFront=false}, ref) => {
    pose = pose === null  ? (isFront ? getRestPoseFront() : getRestPose()) : pose;
    const sweaterHeight = pose.bodyHeight + pose.bodyWidth;
    const personRef = React.useRef(null);
    const sweaterRef = React.useRef(null);
    const rArmRefTop = React.useRef(null);
    const lArmRefTop = React.useRef(null);

    const shoulderMid = getShoulderMid(pose);
    const hipMid = getHipMid(pose);

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
            bendFactor={pose.rArmBendFactor}
            length={pose.armLength} />
    );

    const lArm = (
        <RubberHose ref={lArmRefTop} color={color} outline={null}
            start={{x: pose.lShoulderX, y: pose.lShoulderY}}
            end={{x: pose.lHandX, y: pose.lHandY}}
            width={pose.armWidth}
            bendFactor={pose.lArmBendFactor}
            length={pose.armLength} />
    );

    return (
        <g>
          <g>
            <Person ref={personRef} pose={pose} color={color} outline={outline} isFront={isFront}/>
            { lArm }
            { isFront ?  rArm : null }
            <g ref={sweaterRef}>
                <DirkTrui {...get1DStretchSizePosAngle(TRUI_SHOULDER, TRUI_HIP, TRUI_WIDTH, TRUI_HEIGHT, shoulderMid, hipMid)} isFront={isFront} />
            </g>
            { isFront ?  null : rArm }
          </g>
        </g>
    );
}

const Dirk = React.forwardRef(_Dirk);
export const BreathingDirk = withSizePositionAngle(withBreathing(Dirk), 100, 100);

export default withSizePositionAngle(Dirk, 100, 100);
