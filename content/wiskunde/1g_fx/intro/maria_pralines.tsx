import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import Maria from "./maria_pralines/maria";
import Parlinedoos from "./maria_pralines/parlinedoos";


const _MariaPralines = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <Maria width={xScale.metric(343.328765)} height={yScale.metric(988.618214)} x={xScale(794.411990)} y={yScale(69.143936)} />
          <Parlinedoos width={xScale.metric(159.737985)} height={yScale.metric(80.587973)} x={xScale(886.634414)} y={yScale(462.358953)} />
        </>
    );
};

const MariaPralines = () => {
    return (
        <Drawing top={0} left={0} right={1920.0} bottom={1081.3236}>
            <_MariaPralines/>
        </Drawing>
    );
};

export default MariaPralines;