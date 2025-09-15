import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import * as tf from '@tensorflow/tfjs';

import { scaleLinear } from 'components/drawings/drawing';
import useTensor from 'hooks/useTensor';
import { getColor } from "colors";
import { intToStr } from "utils/number";
import { Plot3D, PLOT_MIN_VALUE, PLOT_MAX_VALUE, PointProjection, SurfacePlot } from "components/drawings/plot3d";
import MD from "components/markdown";

const BILLION_STR = "mld.";
const MILLION_STR = "mln.";
const DECIMAL_CHAR = ",";

// Demo component with example data
export function LossLandscapeSamples() {
    const [wOpp, setWOpp] = useState(3000);
    const [wAfst, setWAfst] = useState(-2500);
    const [mse, setMSE] = useState(203e6);

    const point = useMemo(() => [wOpp, mse, wAfst], [wOpp, wAfst]);

    const xRange = useMemo(() => [-5000, 5000], []);
    const yRange = useMemo(() => [0, 100e9], []);
    const zRange = useMemo(() => [-5000, 5000], []);

    const opps = useTensor(() => tf.tensor([132, 100, 75, 82, 103], [1, 5], 'float32'), []);
    const afsts = useTensor(() => tf.tensor([3.6, 4.6, 4.5, 2.4, 6.4], [1, 5], 'float32'), []);
    const prices = useTensor(() => tf.tensor([388e3, 271e3, 198e3, 259e3, 283e3], [1, 5], 'float32'), []);

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

    const weightProps = useMemo(() => ({
        min: -5000, max: 5000, step: 25
    }), []);

    useEffect(() => {
        if (!opps || !afsts || !prices) return;
        tf.tidy(() => {
            const W = tf.tensor([wOpp, wAfst], [1, 2]);  // 1, 2
            const x = tf.concat([opps, afsts], 0);  // 2, 10
            const ests = tf.matMul(W, x).relu();  // 1, 10
            const mse = tf.mean(tf.squaredDifference(ests, prices));

            mse.data().then(result => {
                const res = Array.from(result);
                setMSE(res[0]);
            });
        });
    }, [wOpp, wAfst, opps, afsts, prices]);

    const [meshData, setMeshData] = useState(null);
    useEffect(() => {
        if (!opps || !afsts || !prices) return;
        tf.tidy(() => {
            const gridSize = 256;

            // Create meshgrid
            const [X, Y] = tf.meshgrid(
                tf.linspace(xRange[0], xRange[1], gridSize),
                tf.linspace(xRange[0], xRange[1], gridSize)
            );
            const X_flat = X.reshape([-1, 1]); // gridSize^2, 2
            const Y_flat = Y.reshape([-1, 1]); // gridSize^2, 2
            const wGrid = tf.concat([X_flat, Y_flat], 1);  // gridSize^2, 2

            const x = tf.concat([opps, afsts], 0);  // 2, 5
            const ests = tf.matMul(wGrid, x).relu();  // gridSize^2, 5
            const mse = tf.mean(tf.squaredDifference(ests, prices), [1], true); // gridSize^2, 1

            const mseUnflat = mse.reshape([gridSize, gridSize, 1]);
            const wGridUnflat = wGrid.reshape([gridSize, gridSize, 2]);

            const meshData = tf.concat([
                wGridUnflat.slice([0, 0, 0], [-1, -1, 1]),
                mseUnflat,
                wGridUnflat.slice([0, 0, 1], [-1, -1, 1]),
            ], 2); // gridSize, gridSize, 3

            meshData.array().then(result => {
                setMeshData(result);
            });
        });
    }, [opps, afsts, prices, xRange]);

    useEffect(() => console.log(meshData), [meshData]);

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
                tickHideThreshold={500}
            >
                {meshData === null ? null : <SurfacePlot data={meshData} color="white" opacity={0.8}/>}
                <PointProjection
                    point={point}
                    xColor={xColor}
                    yColor={yColor}
                    zColor={zColor}
                    formatTickX={formatTickX}
                    formatTickY={formatTickY}
                    formatTickZ={formatTickZ}
                    />
            </Plot3D>
            <Stack alignItems="center">
                <div style={{width: "100%"}}>
                    <MD>{ `Gewicht voor Opp = ${wOpp}`}</MD>
                    <Slider aria-label={`gewicht_opp`} onChange={(event, newValue) => setWOpp(newValue)} {...weightProps} value={wOpp} />
                </div>
                <div style={{width: "100%"}}>
                    <MD>{ `Gewicht voor Afst = ${wAfst}`}</MD>
                    <Slider aria-label={`gewicht_afst`} onChange={(event, newValue) => setWAfst(newValue)} {...weightProps} value={wAfst} />
                </div>
            </Stack>
        </div>
    );
}
