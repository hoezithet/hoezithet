import React, { useContext } from "react";
import { DrawingContext } from "components/shortcodes/drawing";

type GrasProps = {
    width: number,
    x: number,
    y: number,
};

const Gras = (props: GrasProps) => {
    const { xScale, yScale } = useContext(DrawingContext);
    const fill = "#60b652";

    const pxWidth = xScale(props.width) - xScale(0);
    const tfmXScale = pxWidth / 1920;
    const xShift = xScale(props.x);
    const yShift = yScale(props.y) - 74;

    return (
        <g transform={`translate(${xShift} ${yShift})`}>
            <g transform={`scale(${tfmXScale})`}>
                <path
                    d="m 283.963,1179.6724 c 179.14575,-108.6309 1564.4886,-258.93179 1920,-7.6233 V 1315.19 h -1920 z"
                    fill={fill}
                />
            </g>
        </g>
    );
};

export default Gras;