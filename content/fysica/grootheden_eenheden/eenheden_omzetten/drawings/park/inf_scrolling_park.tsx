import React from "react";
import Drawing from "components/shortcodes/drawing";
import Gras from "./gras_inf";
import Bank from "./bank_2";
import Bank2 from "./bank2";
import Struiken from "./struiken_2";
import Bomen from "./bomen2";
import Bomen2 from "./bomen3";
import Vijver from "./vijver";
import withSizePositionAngle from "components/withSizePositionAngle";


const InfScrollingPark = () => {
    return (
        <g>
          <Gras width={3840.723040} height={300} x={-0.361440} y={1080} vAlign="bottom" />
          <Bank width={380.364066} height={197.607134} x={1241.897763} y={1080-150} vAlign="bottom" />
          <Bank2 width={380.364066} height={197.607134} x={2854.736563} y={1080-150} vAlign="bottom"/>
          <Bomen width={601.391651} height={552.952971} x={662.138430} y={1080-170} vAlign="bottom"/>
          <Bomen2 width={492.269204} height={525.914615} x={2238.405198} y={1080-120} vAlign="bottom"/>
          <Bomen2 width={492.269204} height={525.914615} x={3400} y={1080-90} vAlign="bottom"/>
          <Struiken width={515.516628} height={137.875600} x={450} y={1080-130} vAlign="bottom"/>
          <Vijver width={532.290943} height={86.244628} x={1779.549873} y={1080-120} vAlign="bottom"/>
        </g>
    );
};

export default withSizePositionAngle(InfScrollingPark, 3840, 1080);
