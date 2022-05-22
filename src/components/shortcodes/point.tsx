import React from 'react';
import { Line } from './line';

export const Point = ({x, y, color="blue", size=3}) => {
    return <Line xStart={x} yStart={y} xEnd={x} yEnd={y} color={color} lineWidth={size} />
};
