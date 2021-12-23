import React from "react";
import { Drawing} from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import WalkingPerson from "./walkingPerson";
import Zon from "./park/zon";
import Wolken from "./park/wolken";
import withInfLoop from "components/withInfLoop";
import withSizePositionAngle from "components/withSizePositionAngle";
import InfScrollingPark from "./park/inf_scrolling_park";



const LoopingPark = withInfLoop(InfScrollingPark);
const LoopingWolken = withInfLoop(Wolken);


const WandelingInParkChild = () => {
    return (
        <>
            <Zon width={123.693360} height={123.693360} x={303.697226} y={141.611744} />
            <LoopingWolken speed={-10} width={2*1642.394890} height={346.619760} x={0} y={92.659100} />
            <LoopingPark speed={-20} width={3840} x={0} />
            <WalkingPerson height={600} x={1920*1/3} y={1080-50} vAlign="bottom" hAlign="center" />
        </>
    );
};

const WandelingInPark = () => {
    return (
        <Drawing xMin={0} xMax={1920.0} yMin={1080.0} yMax={0} noWatermark>
          <WandelingInParkChild />
        </Drawing>
    );
};

export default WandelingInPark;
