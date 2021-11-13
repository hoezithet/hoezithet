import React, { useContext } from "react";
import withSizePositionAngle from "components/withSizePositionAngle";
import { range } from "lodash";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(MorphSVGPlugin);
}

const WalkCycleContext = React.createContext({tl: null});

const _WalkCycle = () => {
    const [tl, setTl] = React.useState(() => gsap.timeline({repeat: -1}));
    const legWidth = 10;
    const legLength = 60;
    const bendRadius = 2.0;
    const color = "#000000";
    const footAmplX = 15;
    const footAmplY = 15;
    const hipAmpl = 2;
    const freq = 0.75;
    const hip = {
        x: 30,
        y: 30
    };

    return (
        <g>
          <WalkinLegCycle hip={hip} legWidth={legWidth} legLength={legLength} bendRadius={bendRadius} color={color} footAmplX={footAmplX} footAmplY={footAmplY} hipAmpl={hipAmpl} freq={freq} phi={0} tl={tl} />
          <WalkinLegCycle hip={hip} legWidth={legWidth} legLength={legLength} bendRadius={bendRadius} color={color} footAmplX={footAmplX} footAmplY={footAmplY} hipAmpl={hipAmpl} freq={freq} phi={Math.PI} tl={tl} />
        </g>
    );
}


const WalkinLegCycle = ({hip, legWidth, legLength, bendRadius=2.0, color, footAmplX, footAmplY, hipAmpl, freq, phi, tl}) => {
    const legRef = React.useRef();

    const numKeypoints = Math.round(24/freq);
    const period = 1/freq;
    const kpDuration = period/numKeypoints;
    const t0 = phi/(2*Math.PI)*period;
    const kps = range(t0, period + t0, kpDuration);

    const pathDs = kps.map(kp => getWalkingLegString(kp, hip, legLength, footAmplX, footAmplY, hipAmpl, freq, bendRadius));
    
    React.useEffect(() => {
        range(pathDs.length).forEach(i => tl.to(legRef.current, {morphSVG: pathDs[(i + 1) % pathDs.length], duration: kpDuration}, i === 0 ? 0 : '>'));
    }, []);
    
    return (
        <path ref={legRef} d={pathDs[0]} stroke={color} fillOpacity={0} strokeWidth={legWidth} strokeLinecap="round" />
    );
}

const getWalkingLegString = (time, hip, legLength, footAmplX, footAmplY, hipAmpl, freq, bendRadius) => {
    const foot = {
        x: hip.x,
        y: hip.y + legLength * 4/5
    };
    const newFoot = {
        x: foot.x + footAmplX * Math.sin(2 * Math.PI * freq * time),
        y: foot.y - footAmplY * Math.max(0, Math.cos(2 * Math.PI * freq * time))
    };
    const newHip = {
        x: hip.x,
        y: hip.y + hipAmpl * Math.sin(4 * Math.PI * freq * time)
    };


    return getRubberHoseString(newHip, newFoot, legLength, bendRadius);
};


const getRubberHoseString = (start, end, hoseLength, bendRadius) => {
    const [ctrlStart, ctrlEnd] = getRubberHoseCtrlPoints(start, end, hoseLength, bendRadius);
    return `M ${start.x},${start.y} C ${ctrlStart.x},${ctrlStart.y} ${ctrlEnd.x},${ctrlEnd.y} ${end.x},${end.y}`;
};


const getRubberHoseCtrlPoints = (start, end, hoseLength, bendRadius) => {
    const eps = 0.0001;
    bendRadius = typeof bendRadius === 'undefined' ? 1 : bendRadius;

    const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const [dy, dx] = [end.y - start.y, end.x - start.x];
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

    const elongation = Math.min(dist / Math.max(hoseLength, eps), 1.0);

    // Calculate for horizontal hose first, rotate later
    const handleAngle = (1 - elongation)*Math.PI;
    const handleRadius = Math.sign(bendRadius)*(1 / Math.max(Math.abs(bendRadius), eps)) * hoseLength / 2;

    const ctrlStartOffset = rotatePoint({
        x: Math.abs(handleRadius) * Math.cos(-handleAngle),
        y: handleRadius * Math.sin(-handleAngle),
    }, angleX);

    const ctrlStart = {
        x: start.x + ctrlStartOffset.x,
        y: start.y + ctrlStartOffset.y,
    };

    const ctrlEndOffset = rotatePoint({
        x: Math.abs(handleRadius) * Math.cos(Math.PI + handleAngle),
        y: handleRadius * Math.sin(Math.PI + handleAngle),
    }, angleX);
    
    const ctrlEnd = {
        x: end.x + ctrlEndOffset.x,
        y: end.y + ctrlEndOffset.y,
    };

    return [ctrlStart, ctrlEnd];
};

const rotatePoint = (point, angle) => {
    return {
        x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
        y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    };
};

const WalkCycle = withSizePositionAngle(_WalkCycle, 100, 100, true);

export default WalkCycle;
