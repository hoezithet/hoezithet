import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import G3543 from "./onderhandeling/g3543";


const _Onderhandeling = () => {
    const {xScale, yScale} = React.useContext(DrawingContext);

    return (
        <>
          <G3543 width={xScale.metric(1796.932098)} height={yScale.metric(589.604036)} x={xScale(61.533967)} y={yScale(115.230945)} />
        </>
    );
};

const Onderhandeling = () => {
    return (
        <Drawing top={0} left={0} right={1922.0376} bottom={783.55237}>
            <_Onderhandeling/>
        </Drawing>
    );
};

export default Onderhandeling;