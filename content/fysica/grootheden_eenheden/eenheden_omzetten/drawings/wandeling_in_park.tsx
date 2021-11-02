import React from "react";
import { SaveableDrawing as Drawing } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import Zon from "./zon";
import Wolken from "./wolken";
import Gras from "./gras";

const WandelingInPark = () => {
    const dWidth = 192;
    const dHeight = 108;
    const aspect = dWidth / dHeight;

    return (
        <Drawing aspect={aspect} xMax={dWidth} yMax={dHeight}>
            <g>
                <DrawingGrid color="red" opacity={0.05} />
            </g>
            <Zon cx={45} cy={80} r={10} />
            <Wolken width={180} x={10} y={100} />
            <Gras width={dWidth} x={0} y={0} />
        </Drawing>
    );
};

export default WandelingInPark;
