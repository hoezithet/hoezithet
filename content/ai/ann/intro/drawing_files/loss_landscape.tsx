import React, { useRef, useMemo, useState, useCallback } from 'react';

import { scaleLinear } from 'components/drawings/drawing';
import { getColor } from "colors";
import { intToStr } from "utils/number";
import { Plot3D, PLOT_MIN_VALUE, PLOT_MAX_VALUE, PointProjection } from "components/drawings/plot3d";

const BILLION_STR = "mld.";
const MILLION_STR = "mln.";
const DECIMAL_CHAR = ",";

// Demo component with example data
export function LossLandscapeSamples() {
    const point = useMemo(() => [3000, 2.7e9, -2500], []);

    const xRange = useMemo(() => [-5000, 5000], []);
    const yRange = useMemo(() => [1e8, 3e9], []);
    const zRange = useMemo(() => [-5000, 5000], []);

    const formatTickX = useCallback((tick) => tick.toFixed(0), []);
    const formatTickZ = useCallback((tick) => tick.toFixed(0), []);
    const formatTickY = useCallback((tick: number) => {
        let suffix = "";
        if (tick >= 1e9) {
            tick /= 1e9;
            suffix = ` ${BILLION_STR}`;
        } else if (tick >= 1e6) {
            tick /= 1e6;
            suffix = ` ${MILLION_STR}`;
        }

        if (Number.isInteger(tick)) {
            return `${intToStr(tick.toFixed(0))}${suffix}`;
        } else {
            return `${tick.toFixed(1).toString().replace(".", DECIMAL_CHAR)}${suffix}`;
        }
    }, []);

    const xScale = useMemo(() => scaleLinear({
        range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE],
        domain: xRange,
    }), [xRange, PLOT_MIN_VALUE, PLOT_MAX_VALUE]);
    const yScale = useMemo(() => scaleLinear({
        range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE],
        domain: yRange,
    }), [yRange, PLOT_MIN_VALUE, PLOT_MAX_VALUE]);
    const zScale = useMemo(() => scaleLinear({
        range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE],
        domain: zRange,
    }), [zRange, PLOT_MIN_VALUE, PLOT_MAX_VALUE]);

    const xColor = useMemo(() => getColor("blue"), []);
    const yColor = useMemo(() => getColor("darkred"), []);
    const zColor = useMemo(() => getColor("blue"), []);

    return (
        <div>
            <Plot3D
                xLabel="Gewicht voor Opp"
                yLabel="MSE"
                zLabel="Gewicht voor Afst"
                xScale={xScale}
                yScale={yScale} 
                zScale={zScale}
                xColor={xColor}
                yColor={yColor}
                zColor={zColor}
                showAxes={true}
                showTicks={true}
                formatTickX={formatTickX}
                formatTickY={formatTickY}
                formatTickZ={formatTickZ}
                width="90%"
                height="350px"
                backgroundColor="#00000000"
            >
                <PointProjection
                    point={point}
                    xColor={xColor}
                    yColor={yColor}
                    zColor={zColor}
                    xScale={xScale}
                    yScale={yScale} 
                    zScale={zScale}
                    formatTickX={formatTickX}
                    formatTickY={formatTickY}
                    formatTickZ={formatTickZ}
                />
            </Plot3D>
        </div>
    );
}
