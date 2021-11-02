import React, { useContext } from 'react';
import { DrawingContext } from "components/shortcodes/drawing";

type ZonProps = {
    r: number,
    cx: number,
    cy: number
}

const Zon = (props: ZonProps) => {
    const {xScale, yScale, width, height} = useContext(DrawingContext);
    return (
        <circle
            r={xScale(props.r) - xScale(0)}
            cy={yScale(props.cy)}
            cx={xScale(props.cx)}
            fill="#ffb700"
        />
    );
};

export default Zon;