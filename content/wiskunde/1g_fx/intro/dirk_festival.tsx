import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DirkMetMelk from "./dirk_festival/dirk_met_melk";
import Hoedje from "./dirk_festival/hoedje";
import Polsband from "./dirk_festival/polsband";


const _DirkFestival = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <DirkMetMelk width={xScale.metric(360.338639)} height={yScale.metric(887.121650)} x={xScale(779.820542)} y={yScale(182.902888)} />
          <Hoedje width={xScale.metric(219.387796)} height={yScale.metric(114.817185)} x={xScale(843.407482)} y={yScale(37.975459)} />
          <Polsband width={xScale.metric(51.226932)} height={yScale.metric(81.057944)} x={xScale(787.069538)} y={yScale(468.954683)} />
        </>
    );
};

const DirkFestival = () => {
    return (
        <Drawing top={0} left={0} right={1920.0} bottom={1080.0}>
            <_DirkFestival/>
        </Drawing>
    );
};

export default DirkFestival;