import React from 'react';
import { Line } from "./line";

export const HairLines = ({x, y, xStart=0, yStart=0}) => {
    return (
        <>
        <Line xStart={xStart} yStart={y} xEnd={x} yEnd={y} color="light_gray"
            lineWidth={2} dashed={true} />
        <Line xStart={x} yStart={y} xEnd={x} yEnd={yStart} color="light_gray"
            lineWidth={2} dashed={true} />
        </>
    );
};
