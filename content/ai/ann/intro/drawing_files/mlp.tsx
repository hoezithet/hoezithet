import React, { useEffect, useState, useRef } from 'react';
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
import _ from "lodash";

const defaultStyle = {
    nodeRadius: 10,
    nodeColor: 'steelblue',
    edgeColor: '#ccc',
    minEdgeWidth: 1,
    maxEdgeWidth: 3,
    layerSpacing: 50,
    nodeSpacing: 50,
    outputFontSize: 12,
    outputTextPadding: ".5em",
    inputFontSize: 12,
    inputTextPadding: ".5em",
    weightFontSize: 6,
    weightColor: "orange",
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
    console.log("MLPVisualizer");
    const mergedStyle = { ...defaultStyle, ...style };
    const [output, setOutput] = useState([]);

    const [backendReady, setBackendReady] = useState(false);

    useEffect(() => {
        const setupTF = async () => {
            await tf.setBackend('webgl');
            await tf.ready(); // Optional but ensures full readiness
            setBackendReady(true);
        };

        setupTF();
    }, []);

    const layers = weights.map(wl => wl.length);
    // Add number of outputs
    // = number of neurons the last layer
    const lastLayerWeights = weights[weights.length - 1];
    const firstInputWeights = lastLayerWeights[0];  // For each neuron in last layer
    // So length of firstInputWeights is the number of outputs
    layers.push(firstInputWeights.length);

    const [minWeights, setMinWeights] = useState(
        weights.map(
            layerWeights => layerWeights[0].map(() => null)  // A null for each neuron
        )
    );
    const [maxWeights, setMaxWeights] = useState(minWeights);  // Also initialize with nulls

    const [params, setParams] = useState(null);
    useEffect(() => {
        setParams(oldParams => {
            oldParams?.weights.forEach(w => w.dispose());
            oldParams?.biases.forEach(b => b.dispose());
            return {
                weights: weights.map(w_l => tf.tensor(w_l)),
                biases: biases.map(b_l => tf.tensor(b_l)),
            };
        });
    }, [weights, biases, backendReady]);

    // Perform forward pass
    useEffect(() => {
        if (!backendReady)
            return;
        tf.tidy(() => {

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

            x.data().then(result => setOutput(Array.from(result)));
        });
    }, [inputValues, params, backendReady]);

    // Initiate weight scales for edge widths
    useEffect(() => {
        if (!backendReady)
            return;
        if (_.flatten(maxWeights).every(x => x !== null) && minWeights.every(x => x !== null)) // We only set it once
            return;
        tf.tidy(() => {
            weights.map(w_l => tf.tensor(w_l)).map((layerWeights, layerIdx) => {
                tf.abs(layerWeights).array().then((absLayerWeights) => {
                    // layerWeights has shape (M, N) with
                    //   * M = num inputs per neuron
                    //   * N = num neurons
                    // We want the min & max for each neuron, so aggregate over axis 0
                    tf.max(absLayerWeights, 0).array().then((maxWeights) => {
                        setMaxWeights((prevVal) => {
                            const newVal = _.cloneDeep(prevVal);
                            newVal[layerIdx] = maxWeights;
                            return newVal;
                        });
                    });
                    tf.min(absLayerWeights, 0).array().then((minWeights) => {
                        setMinWeights((prevVal) => {
                            const newVal = _.cloneDeep(prevVal); 
                            newVal[layerIdx] = minWeights;
                            return newVal;
                        });
                    });
                });
            });
        });
    }, [backendReady, weights]);

    // SVG group
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
        {_.flatten(maxWeights).some(x => x === null) || _.flatten(minWeights).some(x => x === null) ? null :
        layers.map((layerSize, layerIdx) => {
            const dWidth = mergedStyle.maxEdgeWidth - mergedStyle.minEdgeWidth;

            const layerWeights = weights[layerIdx];

            return [...Array(layerSize)].map((_, neuron1idx) =>
                [...Array(layers[layerIdx + 1])].map((_, neuron2idx) => {
                    const from = getNodePosition(layerIdx, neuron1idx);
                    let to, edgeWidth;
                    if (layerIdx + 1 === layers.length) {
                        // Final layer to output layer
                        to = getNodePosition(layerIdx + 1, neuron1idx);
                        edgeWidth = mergedStyle.minEdgeWidth + dWidth / 2;
                    }
                    else {
                        to = getNodePosition(layerIdx + 1, neuron2idx);

                        const maxNeuronWeight = maxWeights[layerIdx][neuron2idx];
                        const minNeuronWeight = minWeights[layerIdx][neuron2idx];
                        const dWeight = maxNeuronWeight - minNeuronWeight;
                        let weight = layerWeights[neuron1idx][neuron2idx];
                        edgeWidth = mergedStyle.minEdgeWidth + Math.max(0, Math.abs(weight) - minNeuronWeight) / dWeight * dWidth;
                    }

                    return (
                        <line
                            key={`edge-${layerIdx}-${neuron1idx}-${neuron2idx}`}
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            strokeWidth={edgeWidth}
                            strokeLinecap="round"
                            stroke={mergedStyle.edgeColor}
                        />
                        );
                })
            )
        }
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

    {/* Annots at input */}
    {
        [...Array(layers[0])].map((_, nodeIdx) => {
            const { x, y } = getNodePosition(0, nodeIdx);

            const value = inputValues[nodeIdx];
            const text = `${inputProps[nodeIdx].name}~(${inputProps[nodeIdx].unit}) = ${toLatexNumber(value)}`;
            return (
                <Annot key={`annot-${0}-${nodeIdx}`}
                    Wrapper={MathJax}
                    x={x} y={y}
                    fontSize={mergedStyle.inputFontSize}
                    textPadding={mergedStyle.inputTextPadding}
                    align="center right">
                    {text}
                </Annot>
            );
        })
    }

    {/* Annots at output */}
    {
        [...Array(layers.slice(-1)[0])].map((_, nodeIdx) => {
            if (output.length <= nodeIdx)
                return null;

            const { x, y } = getNodePosition(layers.length, nodeIdx);
            const value = output[nodeIdx];
            const text = `${toLatexNumber(value)}~(${outputProps[nodeIdx].unit})`;
            return (
                <Annot key={`annot-${-1}-${nodeIdx}`}
                    Wrapper={MathJax}
                    fontSize={mergedStyle.outputFontSize}
                    textPadding={mergedStyle.outputTextPadding}
                    x={x} y={y}
                    align="center left">
                    {text}
                </Annot>
            );
        })
    }

    {/** Annots at edge weights **/}
    {maxWeights.some(x => x === null) || minWeights.some(x => x === null) ? null :
     layers.slice(0, -1).map((layerSize, layerIdx) =>
        [...Array(layerSize)].map((_, i) =>
            [...Array(layers[layerIdx + 1])].map((_, j) => {
                const weightColorTex = "\\" + mergedStyle.weightColor;

                const from = getNodePosition(layerIdx, i);
                const to = getNodePosition(layerIdx + 1, j);
                const mid = {x: (to.x + from.x)/2, y: (to.y + from.y)/2};

                // Calculate the angle in radians, then convert to degrees
                const angleRad = Math.atan2(to.y - from.y, to.x - from.x);
                const angleDeg = (angleRad * 180) / Math.PI;

                const weight = weights[layerIdx][i][j];
                let weightStr = toLatexNumber(weight);
                weightStr = `{${weightColorTex}{${weightStr}}}`;
                if (weight < 0)
                    weightStr = `(${weightStr})`;
                const text = `\\times ${weightStr}`;

                // Create the transform string
                const transform = `rotate(${angleDeg} ${mid.x} ${mid.y})`;
                return (
                    <g transform={transform}>
                        <Annot
                            key={`weight-${layerIdx}-${i}-${j}`}
                            Wrapper={MathJax}
                            x={mid.x} y={mid.y}
                            fontSize={mergedStyle.weightFontSize}
                            align="bottom center">
                            {text}
                        </Annot>
                    </g>
                    );
            })
        )
    )}
</g>
);
}

function MLPVisualizerWrapper({
    ...props
}) {
    const {xScale, yScale} = React.useContext(DrawingContext);
    return (
        <g transform={`translate(${xScale(-15)},${yScale(0)})`}>
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
        {name: "\\text{Waarde}", unit: "\\si{euro}"},
        {name: "\\text{Waarde}", unit: "\\si{euro}"},
        {name: "\\text{Waarde}", unit: "\\si{euro}"},
    ],
    layerName = "Laag",
    weightProps = [
        [ // Layer 1
            [ // Input 1
                // Neuron 1
                {value: 3000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 2
                {value: 500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 3
                {value: 1800, min: -5000, max: 5000, step: 100, name: "Gewicht"},
            ],
            [ // Input 2
                // Neuron 1
                {value: -2500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 2
                {value: 1000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 3
                {value: 1400, min: -5000, max: 5000, step: 100, name: "Gewicht"},
            ],
        ],
        [ // Layer 2
            [ // Input 1
                // Neuron 1
                {value: 3000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 2
                {value: 500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 3
                {value: 1800, min: -5000, max: 5000, step: 100, name: "Gewicht"},
            ],
            [ // Input 2
                // Neuron 1
                {value: -2500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 2
                {value: 1000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 3
                {value: 1400, min: -5000, max: 5000, step: 100, name: "Gewicht"},
            ],
            [ // Input 3
                // Neuron 1
                {value: -2500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 2
                {value: 1000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                // Neuron 3
                {value: 1400, min: -5000, max: 5000, step: 100, name: "Gewicht"},
            ],
        ],
    ]
}) => {
    const [inputValues, setInputValues] = useState(inputProps.map(r => r.value));

    const [weights, setWeights] = useState(
        weightProps.map(
            layerWeights => layerWeights.map(
                inputWeights => inputWeights.map(
                    prop => prop.value
                )
            )
        )
    );
    const [biases, setBiases] = useState([[0, 0, 0], [0,0,0]]);

    const handleInputChanges = inputValues.map((_, idx) => (event, newValue) => {
        setInputValues((currInputs) => {
            if (newValue === currInputs[idx])
                return currInputs;
            const newInputs = [...currInputs];
            newInputs[idx] = newValue;
            return newInputs;
        });
    });

    const handleWeightChanges = weights.map((layerWeights, layerIdx) =>
        layerWeights.map((weightRow, inputIdx) =>
            weightRow.map((weight, neuronIdx) =>
                (event, newValue) => {
                    setWeights((currWeights) => {
                        if (newValue === currWeights[layerIdx][inputIdx][neuronIdx])
                            return currWeights
                        const newWeights = _.cloneDeep(currWeights);
                        newWeights[layerIdx][inputIdx][neuronIdx] = newValue;
                        return newWeights;
                    });
                })
        )
    );

    const handleBiasChanges = biases.map((layerBiases, layerIdx) =>
        layerBiases.map((bias, i) =>
            (event, newValue) => {
                setInputValues((currBiases) => {
                    const newBiases = _.cloneDeep(currBiases);
                    currBiases[layerIdx][i] = newValue;
                    return newBiases;
                });
            })
    );

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
                        <Slider aria-label={`input${i+1}`} key={i} onChange={handleInputChanges[i]} {...inputProps[i]} value={v} />
                    </React.Fragment>
                    )
                )
            }
            <Stack direction="row">
                {
                    weights.map((layerWeights, layerIdx) => (
                        <React.Fragment key={`layer-${layerIdx}`}>
                            <Stack>
                                {[
                                    <MD>{`**${layerName} ${layerIdx + 1}**`}</MD>,
                                    ...layerWeights.map((weightRow, i) =>
                                    weightRow.map((weight, j) =>
                                    <React.Fragment key={`weight-${layerIdx}-${i}-${j}`}>
                                        <MD>{ `$\\text{${weightProps[layerIdx][i][j].name}}~(${i+1}, ${j+1}) = ${toLatexNumber(weight)}$` }</MD>
                                        <Slider aria-label={`weight-${layerIdx}-${i}-${j}`} onChange={handleWeightChanges[layerIdx][i][j]} {...weightProps[layerIdx][i][j]} value={weight} />
                                    </React.Fragment>
                                    )
                                )]}
                            </Stack>
                        </React.Fragment>
                    ))
                }
            </Stack>
        </Stack>
    );
}

export default MLPVisualizer;
