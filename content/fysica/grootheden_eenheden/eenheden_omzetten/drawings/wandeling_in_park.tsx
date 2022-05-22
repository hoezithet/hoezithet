import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import WalkingPerson from "./walkingPerson";
import Zon from "./park/zon";
import Wolken from "./park/wolken";
import withInfLoop from "components/withInfLoop";
import withSizePositionAngle from "components/withSizePositionAngle";
import withDrawingScale from "components/withDrawingScale";
import InfScrollingPark from "./park/inf_scrolling_park";



const LoopingPark = withInfLoop(InfScrollingPark);
const LoopingWolken = withInfLoop(Wolken);


const _WandelingInParkChild = () => {
    return (
        <>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-30} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <LoopingPark speed={-75} width={3840} x={0} y={1080} vAlign="bottom"/>
            <WalkingPerson height={600} x={1920*1/3} y={1080-50} vAlign="bottom" hAlign="center" />
        </>
    );
};


const WandelingInParkChild = withDrawingScale(_WandelingInParkChild, 1920, 1080);

const WandelingInPark = () => {
    return (
        <Drawing left={0} right={1920.0} bottom={1080.0} top={0} noWatermark>
          <WandelingInParkChild />
        </Drawing>
    );
};

export default WandelingInPark;
