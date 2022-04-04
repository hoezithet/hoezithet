import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { SvgNote } from "components/shortcodes/svgNote";
import {isoTopTfm, isoLeftTfm, isoRightTfm} from "utils/isoTransform";

import { getColor } from "colors";
import Dirk from "./dirk";

const RunnersTrack = ({x=0, y=0, lineMargin=50, lineWidth=3, width, height, startLineX}) => {
    const {xScale, yScale} = React.useContext(DrawingContext);
    x = xScale(x);
    y = yScale(y);
    width = xScale.metric(width);
    height = yScale.metric(height);
    const [lineX1, lineX2, lineY] = [x, x + width, y + yScale.metric(lineMargin)];
    const line2Y = y + height - yScale.metric(lineMargin);
    lineWidth = yScale.metric(lineWidth);
    const startLineWidth = xScale.metric(10);
    startLineX = xScale(startLineX);
    const [noteX, noteY, noteFontSize] = [xScale.metric(50), height / 2, xScale.metric(200)];
    const cos30 = Math.sqrt(3)/2;

    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={getColor("light_red")} />
            <line x1={lineX1} y1={lineY} x2={lineX2} y2={lineY} stroke={getColor("near_white")} strokeWidth={lineWidth} />
            <line x1={lineX1} y1={line2Y} x2={lineX2} y2={line2Y} stroke={getColor("near_white")} strokeWidth={lineWidth} />
            <g transform={`translate(${startLineX}, ${y}) skewX(30)`}>
                <line x1={0} y1={0} x2={0} y2={height}  stroke={getColor("near_white")} strokeWidth={startLineWidth} />
                <g transform={`translate(${noteX}, ${noteY}) rotate(90)`}>
                    <text fontSize={`${noteFontSize}px`} textAnchor="middle" fill={getColor("near_white")}>{`1`}</text>
                </g>
            </g>
        </g>
    );
};


const DirkReadyToSprint = () => {
    const trackHeight = 250;
    const [dWidth, dHeight] = [1920, 500];
    const [dirkX, dirkY, dirkHeight] = [dWidth * 1/3, dHeight - trackHeight/2, 600];
    const pose = getReadyToSprintPose();
    const startLineX = 350;

    return (
        <Drawing xMin={0} xMax={dWidth} yMin={dHeight} yMax={0} noWatermark>
            <RunnersTrack y={dHeight-trackHeight} width={dWidth} height={trackHeight} startLineX={startLineX} />
            <Dirk pose={pose} height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="right"/>
            {/** <DrawingGrid minorX={50} majorX={100} minorY={50} majorY={100} /> **/}
        </Drawing>
    );
};


const getReadyToSprintPose = ({
    headSize=18,
    armWidth=8, armLength=38, armBendRadius=-2.0,
    legWidth=10, legLength=54, legBendRadius=2.0,
    bodyWidth=17, bodyHeight=27, bodyBendRadius=-2.0
}={}) => {
    const yOff = 52;
    const rFoot = {
        x: 35,
        y: 48 + yOff,
    };
    const headPoint = {
        x: 63,
        y: 12 + yOff,
    };
    const lFoot = {
        x: legWidth/2,
        y: rFoot.y,
    };
    const rHip = {
        x: 22,
        y: 23  + yOff,
    };
    const lHip = {
        ...rHip
    };
    const torso = {
        x: 48,
        y: 23  + yOff,
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
        x: 54,
        y: rFoot.y
    };
    const lHand = {
        x: 56,
        y: lFoot.y
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
        rArmBendRadius: armBendRadius,
        lArmBendRadius: armBendRadius,
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
        lLegBendRadius: legBendRadius,
        rLegBendRadius: legBendRadius,
  };
};


export default DirkReadyToSprint;
