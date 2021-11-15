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
    const bodyRef = React.useRef();
    const rArmRef = React.useRef();
    const lArmRef = React.useRef();

    const legWidth = 8;
    const legLength = 40;
    const legBendRadius = 2.0;
    const bodyWidth = 13;
    const bodyHeight = 32;
    const bodyBendRadius = -20;
    const armSwingAngle = Math.PI/6;
    const armLength = bodyHeight;
    const armWidth = legWidth*3/4;
    const armBendRadius = -2.0;
    const headSize = 14;

    const color = "#000000";
    const outline = "#efefef";
    const footAmpl = {
        x: 12,
        y: 8
    };
    const hipAmpl = {
        x: 0,
        y: 1
    };
    const shoulderAmpl = {
        x: 0,
        y: 0,
    };
    const handAmpl = {
        x: 10,
        y: 3,
    };

    const freq = 0.75;
    const period = 1/freq;
    const numKeypoints = Math.round(24/freq);
    const kps = range(0, 2*period, period/numKeypoints);

    const foot = {
        x: 50,
        y: 100 - legWidth/2
    };
    const hip = {
        x: foot.x,
        y: foot.y - legLength * 0.8
    };
    const shoulder = {
        x: hip.x + bodyHeight * 0.1,
        y: hip.y - bodyHeight * 0.65
    };
    const hand = {
        x: shoulder.x,
        y: shoulder.y + armLength * 0.8
    };
    const head = {
        x: hip.x + headSize*0.6,
        y: shoulder.y - headSize
    }

    const hipKps = getKeypoints(kps, t => getWalkingHip(t, hip, hipAmpl, freq, 0));

    const lFootKps = getKeypoints(kps, t => getWalkingFoot(t, foot, footAmpl, freq, 0));
    const lShoulderKps = getKeypoints(kps, t => getWalkingShoulder(t, shoulder, shoulderAmpl, freq, 0));
    const lHandKps = getKeypoints(kps, t => getWalkingHand(t, hand, handAmpl, freq, Math.PI));
    const lLegKps = getHoseKeypoints(hipKps, lFootKps);
    const lArmKps = getHoseKeypoints(lShoulderKps, lHandKps);

    const rFootKps = getKeypoints(kps, t => getWalkingFoot(t, foot, footAmpl, freq, Math.PI));
    const rShoulderKps = getKeypoints(kps, t => getWalkingShoulder(t, shoulder, shoulderAmpl, freq, Math.PI));
    const rHandKps = getKeypoints(kps, t => getWalkingHand(t, hand, handAmpl, freq, 0));
    const rLegKps = getHoseKeypoints(hipKps, rFootKps);
    const rArmKps = getHoseKeypoints(rShoulderKps, rHandKps);
    
    const bodyKps = [{time: 0, start: {x: shoulder.x, y: shoulder.y + bodyWidth/8}, end: {x: hip.x, y: hip.y - bodyWidth/8}}];

    const kpDurations = getKpDurations(hipKps);

    React.useEffect(() => {
        range(hipKps.length).forEach(i => tl.to([bodyRef.current, rArmRef.current], {y: hipKps[(i + 1) % hipKps.length].y - hip.y, duration: kpDurations[i]}, i === 0 ? 0 : '>'));
    }, [...hipKps, tl]);

    return (
        <g>
          <g ref={lArmRef}>
            <AnimatedHoseCycle hoseKps={lArmKps} hoseWidth={armWidth} hoseLength={armLength} bendRadius={armBendRadius} color={color} outline={outline} tl={tl} />
          </g>
          <AnimatedHoseCycle hoseKps={lLegKps} hoseWidth={legWidth} hoseLength={legLength} bendRadius={legBendRadius} color={color} outline={outline} tl={tl} />
          <AnimatedHoseCycle hoseKps={rLegKps} hoseWidth={legWidth} hoseLength={legLength} bendRadius={legBendRadius} color={color} outline={outline} tl={tl} />
          <g ref={bodyRef}>
            <circle fill={color} stroke={outline} strokeWidth={1} cx={head.x} cy={head.y} r={headSize/2} />
            <AnimatedHoseCycle hoseKps={bodyKps} hoseWidth={bodyWidth} hoseLength={bodyHeight} bendRadius={bodyBendRadius} color={color} outline={outline}  tl={tl} />
          </g>
          <AnimatedHoseCycle hoseKps={rLegKps} hoseWidth={legWidth} hoseLength={legLength} bendRadius={legBendRadius} color={color} tl={tl} />
          <g ref={rArmRef}>
            <AnimatedHoseCycle hoseKps={rArmKps} hoseWidth={armWidth} hoseLength={armLength} bendRadius={armBendRadius} color={color} outline={outline} tl={tl} />
          </g>
        </g>
    );
}

const getHoseKeypoints = (startKps, endKps) => {
    return startKps.map((startKp, i) => {
        return {
            time: startKp.time,
            start: {
                x: startKp.x,
                y: startKp.y
            },
            end: {
                x: endKps[i].x,
                y: endKps[i].y
            }
        };
    });
};

const getKeypoints = (times, getPointAtTime) => {
    return times.map(t => {
        return {
            time: t,
            ...getPointAtTime(t)
        }
    });
};

const getKpDurations = (kps) => {
    return kps.reduce((prev, curr, i, arr) => {
        prev.push(i === 0 ? curr.time : curr.time - arr[i - 1].time);
        return prev;
    }, []);
};

const AnimatedHoseCycle = ({hoseWidth, hoseLength, hoseKps, bendRadius, color, tl, outline=null}) => {
    const hoseRef = React.useRef();
    const hoseRefOutline = React.useRef();

    const kpDurations = getKpDurations(hoseKps);
    const pathDs = hoseKps.map(kp => getRubberHoseString(kp.start, kp.end, hoseLength, bendRadius));

    React.useEffect(() => {
        range(pathDs.length).forEach(i => tl.to([hoseRef.current, hoseRefOutline.current], {morphSVG: pathDs[(i + 1) % pathDs.length], duration: kpDurations[i]}, i === 0 ? 0 : '>'));
    }, [...pathDs, tl]);

    return (
        <>
            { outline !== null ? <path ref={hoseRefOutline} d={pathDs[0]} stroke={outline} fillOpacity={0} strokeWidth={hoseWidth + 1} strokeLinecap="round" /> : null }
            <path ref={hoseRef} d={pathDs[0]} stroke={color} fillOpacity={0} strokeWidth={hoseWidth} strokeLinecap="round" />
        </>
    );
}

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