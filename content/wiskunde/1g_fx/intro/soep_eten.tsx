import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import Frigo from "./soep_eten/frigo";
import Use2471 from "./soep_eten/use2471";
import Soepkommetje from "./soep_eten/soepkommetje";
import ChairDirk from "./soep_eten/chair_dirk";
import Dirk from "./soep_eten/dirk";
import Maria from "./soep_eten/maria";
import ChairMaria from "./soep_eten/chair_maria";
import Table from "./soep_eten/table";


const _SoepEten = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <Frigo width={xScale.metric(298.501333)} height={yScale.metric(640.698860)} x={xScale(811.768147)} y={yScale(53.301808)} />
          <Soepkommetje width={xScale.metric(100.652724)} height={yScale.metric(103.715737)} x={xScale(1505.380614)} y={yScale(314.598504)} />
          <Soepkommetje width={xScale.metric(100.652724)} height={yScale.metric(103.715737)} x={xScale(303.380099)} y={yScale(314.598504)} />
          <ChairDirk width={xScale.metric(169.547605)} height={yScale.metric(361.887311)} x={xScale(1688.918454)} y={yScale(329.387569)} />
          <Dirk width={xScale.metric(234.664953)} height={yScale.metric(523.525710)} x={xScale(1609.205614)} y={yScale(151.494084)} />
          <Maria width={xScale.metric(266.600316)} height={yScale.metric(563.230650)} x={xScale(78.680183)} y={yScale(115.230984)} />
          <ChairMaria width={xScale.metric(169.547597)} height={yScale.metric(361.887311)} x={xScale(61.533967)} y={yScale(342.947720)} />
          <Table width={xScale.metric(1358.564709)} height={yScale.metric(274.177566)} x={xScale(281.395575)} y={yScale(420.331926)} />
        </>
    );
};

const SoepEten = () => {
    return (
        <Drawing top={0} left={0} right={1922.0376} bottom={783.55237}>
            <_SoepEten/>
        </Drawing>
    );
};

export default SoepEten;
