import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { MathJax } from "components/mathjax";
import MD from "components/markdown";
import { toLatexNumber } from "utils/number";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";

const defaultStyle = {
    nodeRadius: 10,
    nodeColor: 'steelblue',
    edgeColor: '#ccc',
    edgeWidth: 1,
    layerSpacing: 50,
    nodeSpacing: 50,
};

function MLPVisualizer({
    weights,
    biases,
    inputValues,
    inputProps,
    outputProps,
    hiddenActivation = x => tf.tidy(() => tf.relu(x)),
    outputActivation = x => tf.tidy(() => tf.relu(x)),
    style = {
        nodeColor: 'orange',
        edgeColor: 'gray',
        nodeRadius: 8,
    },
}) {
    const mergedStyle = { ...defaultStyle, ...style };
    const [output, setOutput] = useState([]);

    // Create weights and biases randomly (for demo)
    const params = {
        weights: weights.map(w_l => tf.tensor(w_l)),
        biases: biases.map(b_l => tf.tensor(b_l)),
    };

    // Perform forward pass
    useEffect(() => {
        const forwardPass = async () => {
            await tf.setBackend('webgl');
            await tf.ready();

            const input = tf.tensor(inputValues, [1, params.weights[0].shape[0]]);
            let x = input;

            for (let i = 0; i < params.weights.length - 1; i++) {
                x = x.matMul(params.weights[i]).add(params.biases[i]);
                x = hiddenActivation(x); // Apply activation
            }

            // Output layer
            x = x.matMul(params.weights[params.weights.length - 1])
                .add(params.biases[params.biases.length - 1]);
            x = outputActivation(x); // Apply output activation

            const result = await x.data();
            setOutput(Array.from(result));
        };

        forwardPass();
    }, [inputValues, weights, biases, hiddenActivation, outputActivation]);

    const layers = weights.map(wl => wl.length);
    layers.push(params.weights[weights.length - 1].shape[1]);

    // SVG Drawing
    const width = (layers.length + 1) * mergedStyle.layerSpacing;
    const height = Math.max(...layers) * mergedStyle.nodeSpacing;

    const getNodePosition = (layerIdx, nodeIdx) => {
        const x = layerIdx * mergedStyle.layerSpacing;
        const layerHeightIdx = Math.min(layerIdx, layers.length - 1);
        const layerHeight = layers[layerHeightIdx] * mergedStyle.nodeSpacing;
        const y = height / 2 - layerHeight / 2 + nodeIdx * mergedStyle.nodeSpacing;
        return { x, y };
    };

    return (
        <g>
            {/* Edges */}
        {layers.map((layerSize, layerIdx) =>
            [...Array(layerSize)].map((_, i) =>
                [...Array(layers[layerIdx + 1])].map((_, j) => {
                    const from = getNodePosition(layerIdx, i);
                    const to = getNodePosition(layerIdx + 1, j);
                    return (
                        <line
                            key={`edge-${layerIdx}-${i}-${j}`}
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            stroke={mergedStyle.edgeColor}
                            strokeWidth={mergedStyle.edgeWidth}
                        />
                        );
                })
            )
        )}

    {/* Nodes */}
    {layers.slice(1).map((layerSize, i) =>
        [...Array(layerSize)].map((_, nodeIdx) => {
            const { x, y } = getNodePosition(i+1, nodeIdx);
            return (
                <circle
                    key={`node-${i+1}-${nodeIdx}`}
                    cx={x}
                    cy={y}
                    r={mergedStyle.nodeRadius}
                    fill={mergedStyle.nodeColor}
                />
                );
        })
    )}

    {/* Annots at in and output */}
    {
        [...Array(layers[0])].map((_, nodeIdx) => {
            const { x, y } = getNodePosition(0, nodeIdx);

            const value = inputValues[nodeIdx];
            const text = `${inputProps[nodeIdx].name} = ${toLatexNumber(value)}~${inputProps[nodeIdx].unit}`;
            return (
                <Annot key={`annot-${0}-${nodeIdx}`}
                    Wrapper={MathJax}
                    x={x} y={y}
                    align="center right">
                    {text}
                </Annot>
            );
        })
    }
</g>
);
}

function MLPVisualizerWrapper({
    ...props
}) {
    const {xScale, yScale} = React.useContext(DrawingContext);
    return (
        <g transform={`translate(${xScale(0)},${yScale(0)})`}>
            <MLPVisualizer {...props}/>
        </g>
    );
}


export const InteractiveMLP = ({
    inputProps = [
        {value: 230, min: 0, max: 500, step: 10, name: "\\text{Opp}", unit: "\\si{m}^2"},
        {value: 5, min: 0, max: 100, step: 1, name: "\\text{Afst}", unit: "\\si{km}"},
    ],
    outputProps = [
        {name: "\\text{Waarde}", unit: "\\si{€}"},
    ],
}) => {
    const [inputValues, setInputValues] = useState(inputProps.map(r => r.value));

    const weights = [
        [   // L1 -> L2
            [3000],
            [-2500]
        ],
    ];
    const biases = [
        0,
    ];

    const handleChanges = inputValues.map((_, idx) => (event, newValue) => {
        setInputValues((currInputs) => {
            const newInputs = [...currInputs];
            newInputs[idx] = newValue;
            return newInputs;
        });
    });

    const sliderProps = {
        value: 230,
        min: 0,
        max: 500,
        step: 10,
    };

    return (
        <Stack alignItems="center">
            <Drawing left={-50} right={50} bottom={50} top={-50} noWatermark>
                <MLPVisualizerWrapper inputValues={inputValues} inputProps={inputProps} outputProps={outputProps} weights={weights} biases={biases}/>
                <DrawingGrid major={20} minor={10} showText/>
            </Drawing>
            {
                inputValues.map((v, i) => (
                    <React.Fragment key={i}>
                        <MD>{ `$${inputProps[i].name} = ${toLatexNumber(v)}~${inputProps[i].unit}$` }</MD>
                        <Slider aria-label={`input${i+1}`} key={i} onChange={handleChanges[i]} {...inputProps[i]} value={v} />
                    </React.Fragment>
                    )
                )
            }
        </Stack>
    );
}

export default MLPVisualizer;
