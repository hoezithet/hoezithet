import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import Stuur from "./maria_segway/stuur";
import Maria from "./maria_segway/maria";
import Wiel from "./maria_segway/wiel";
import MotionBlur from "./maria_segway/motion_blur";


const _MariaSegway = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <Stuur width={xScale.metric(145.325287)} height={yScale.metric(420.598063)} x={xScale(1215.967630)} y={yScale(358.614729)} />
          <Maria width={xScale.metric(322.701969)} height={yScale.metric(588.185919)} x={xScale(1059.769885)} y={yScale(76.689062)} />
          <Wiel width={xScale.metric(255.644729)} height={yScale.metric(255.644729)} x={xScale(999.565647)} y={yScale(613.356626)} />
          <MotionBlur width={xScale.metric(666.476998)} height={yScale.metric(192.942276)} x={xScale(298.627490)} y={yScale(299.107656)} />
        </>
    );
};

const MariaSegway = () => {
    return (
        <Drawing top={0} left={0} right={1922.0376} bottom={915.90167}>
            <_MariaSegway/>
        </Drawing>
    );
};

export default MariaSegway;