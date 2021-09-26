import React, { useContext } from 'react';
import _ from "lodash";

import { DrawingContext } from "./drawing";
import Spring from "./spring";
import Mass from "./mass";
import Wall from "./wall";
import { Line } from "./line";
import Ruler from "./ruler";

const isBrowser = typeof window !== "undefined";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";


if (isBrowser) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);
}


type VMassSpringProps = {
    x: number,
    y: number,
}

const VMassSpring = ({x, y}: VMassSpringProps) => {
    const {xScale, yScale} = useContext(DrawingContext);
    const [time, setTime] = React.useState(0);
    const groupIdRef = React.useRef(_.uniqueId("vms-group-"));
    const handleIdRef = React.useRef(_.uniqueId("vms-handle-"));
    const groupId = groupIdRef.current;
    const handleId = handleIdRef.current;
    
    const rulerSize = 50;
    const m = 0.1;
    const k = 9.81/150;
    const restLength = 30;
    const g = 9.81;
    const lengthWithMass = restLength + m*g/k;
    const springTop = 90;
    const initSpringBottom = springTop - lengthWithMass;
    const [springBottom, setSpringBottom] = React.useState(initSpringBottom);
    const ang_freq = Math.sqrt(k/m);
    const [amplitude, setAmplitude] = React.useState(30);
    const [phi0, setPhi0] = React.useState(0);
    const damp = 0.66;
    const timeRef = React.useRef(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const handleRadiusPx = 15;
    const [handleTopPx, setHandleTopPx] = React.useState(yScale(initSpringBottom));
    
    React.useEffect(() => {
        const target = `#${handleId}`;
        
        Draggable.create(target, {
            type: "y",
            bounds: `#${groupId}`,
            onDragStart: () => {
                setIsDragging(true);
                InertiaPlugin.track(target, "y");
            },
            onDrag: () => {
                const handleY = gsap.getProperty(target, 'y');
                const newSpringBottom = yScale.invert(yScale(initSpringBottom) + handleY);
                setSpringBottom(newSpringBottom);
            },
            onDragEnd: () => {
                const vPx = InertiaPlugin.getVelocity(target, "y");
                const vy = yScale.invert(vPx + yScale(0));
                const handleY = gsap.getProperty(target, 'y');
                const newSpringBottom = yScale.invert(yScale(initSpringBottom) + handleY);
                const y = newSpringBottom - initSpringBottom;
                const eMech = m*Math.pow(vy, 2)/2 + k*Math.pow(y, 2)/2;
                const yMax = Math.sqrt(eMech*2/k);
                
                setPhi0(vy > 0 ? Math.asin(y/yMax) : Math.PI - Math.asin(y/yMax));
                setAmplitude(yMax);
                setIsDragging(false);
                InertiaPlugin.untrack(target, "y");
                gsap.set(target, {y: 0});
            },
        });
    }, [handleId, groupId]);
    
    React.useEffect(() => {
        timeRef.current = 0;
        
        const updateShm = (_, deltaTime) => {
            if (isDragging) {
                gsap.ticker.remove(updateShm);
                return;
            }
            timeRef.current += deltaTime/1000;
            const time = timeRef.current;
            const dampedAmp = amplitude * Math.exp(-damp*time);
            if (dampedAmp < 0.01) {
                setSpringBottom(initSpringBottom);
                gsap.ticker.remove(updateShm);
                return;
            }
            const dampedShm = dampedAmp * Math.sin(ang_freq*time + phi0);
            const newSpringBottom = initSpringBottom + dampedShm;
            setSpringBottom(newSpringBottom);
            setHandleTopPx(yScale(newSpringBottom));
        };
        
        gsap.ticker.add(updateShm);
        
        return () => gsap.ticker.remove(updateShm);
    }, [isDragging, amplitude]);

    x = xScale(x);
    y = yScale(y);

    return (
        <g id={groupId}>
            <Line xStart={110} xEnd={120} yStart={springBottom} yEnd={springBottom} color="light_gray" opacity={_.inRange(springTop - springBottom, rulerSize) ? "1" : "0"} dashed />
            <Ruler x={110} y={90} angle={90} size={rulerSize} unit="mm" emphasize={Math.round(springTop - springBottom)} />
            <Spring x={120} y={springTop} angle={90} length={springTop - springBottom} />
            <Wall x={115} y={90} width={10} height={5} />
            <Mass x={120} y={springBottom} />
            <circle id={handleId} cx={xScale(120)} cy={handleTopPx + handleRadiusPx} r={handleRadiusPx} fill="red" opacity="0"/>
        </g>
    );
};

export default VMassSpring;
