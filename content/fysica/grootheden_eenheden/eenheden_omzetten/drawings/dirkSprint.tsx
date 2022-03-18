import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";

import Dirk from "./dirk";


const DirkReadyToSprint = () => {
    const [dirkX, dirkY, dirkHeight] = [1920 * 2/3, 1080-50, 600];
    const pose = getReadyToSprintPose();

    return (
        <Drawing xMin={0} xMax={1920.0} yMin={1080.0} yMax={0} noWatermark>
            <DrawingGrid minorX={50} majorX={100} minorY={50} majorY={100} />
            <Dirk pose={pose} flipH height={dirkHeight} x={dirkX} y={dirkY} vAlign="bottom" hAlign="left"/>
        </Drawing>
    );
};


const getReadyToSprintPose = ({
    headSize=18,
    armWidth=8, armLength=38, armBendRadius=-2.0,
    legWidth=10, legLength=54, legBendRadius=2.0,
    bodyWidth=17, bodyHeight=27, bodyBendRadius=-2.0
}={}) => {
    const rFoot = {
        x: 35,
        y: 48
    };
    const headPoint = {
        x: 63,
        y: 9,
    };
    const lFoot = {
        x: legWidth/2,
        y: rFoot.y,
    };
    const rHip = {
        x: 25,
        y: 25
    };
    const lHip = {
        ...rHip
    };
    const torso = {
        x: 48,
        y: 20
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
