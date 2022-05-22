import React, { useContext } from 'react';

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { useStyles } from "./line";

const Spring = ({x=0, y=0, length=30, endsLength=5, loopDiameter=10, numLongLoops=10, numShortLoops=3, color="gray", opacity=1, lineWidth=3, angle=0}) => {
    const {xScale, yScale} = useContext(DrawingContext);
    const classes = useStyles({color: getColor(color), lineWidth: lineWidth, opacity: opacity});
    const totalLoopSize = (length - 2*endsLength);
    const totalLongLoopSize = totalLoopSize*(18/20);
    const totalShortLoopSize = totalLoopSize*(1/20);
    const longLoopSize = totalLongLoopSize/numLongLoops;
    const shortLoopSize = totalShortLoopSize/numShortLoops;
    
    const sLoopDiameter = yScale(0) - yScale(loopDiameter);
    const sLongLoopSize = xScale(longLoopSize) - xScale(0);
    const sShortLoopSize = xScale(shortLoopSize) - xScale(0);
    const sEndsLength = xScale(endsLength) - xScale(0);
    
    const getLoopStr = (loopSize, loopDiameter) => `l ${loopSize/4} ${-loopDiameter/2} l ${loopSize/2} ${loopDiameter} l ${loopSize/4} ${-loopDiameter/2}`;
    const longLoopStr = getLoopStr(sLongLoopSize, sLoopDiameter);
    const shortLoopStr = getLoopStr(sShortLoopSize, sLoopDiameter);
    return (
        <g transform={`translate(${xScale(x)} ${yScale(y)}) rotate(${angle})`} >
            <path d={`M 0,0 h ${sEndsLength} ${shortLoopStr.repeat(numShortLoops)} ${longLoopStr.repeat(numLongLoops)} ${shortLoopStr.repeat(numShortLoops)} h ${sEndsLength}`} className={classes.line}/>
        </g>
    );
};

export default Spring;
