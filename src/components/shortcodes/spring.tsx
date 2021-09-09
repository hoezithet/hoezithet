import React, { useContext } from 'react';

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { useStyles } from "./line";

const Spring = ({x=0, y=0, restLength=30, elongation=0, endsLength=5, numLoops=5, color="gray", opacity=1, lineWidth=3, angle=0}) => {
    const {xScale, yScale} = useContext(DrawingContext);
    const classes = useStyles({color: getColor(color), lineWidth: lineWidth, opacity: opacity});
    const loopRestSize = (restLength - 2*endsLength) / numLoops;
    const loopSize = loopRestSize + elongation / numLoops;
    const scaledLoopSize = xScale(loopSize) - xScale(0);
    const scaledEndsLength = xScale(endsLength) - xScale(0);
    const loopStr = `l ${scaledLoopSize/4},-${endsLength} l ${scaledLoopSize/2},${endsLength*2} l ${scaledLoopSize/4},-${endsLength}`;
    return (
        <g transform={`translate(${xScale(x)} ${yScale(y)}) rotate(${angle})`} >
            <path d={`M 0,0 h ${scaledEndsLength} ${loopStr.repeat(numLoops)} h ${scaledEndsLength}`} className={classes.line}/>
        </g>
    );
};

export default Spring;
