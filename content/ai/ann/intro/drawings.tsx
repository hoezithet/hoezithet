import React, { useState, useEffect } from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import withDrawingScale from "components/withDrawingScale";
import { MathJax as M } from "components/mathjax";
import MD from "components/markdown";
import useId from 'hooks/useId';
import { parseNumber, toLatexNumber } from "utils/number";
import { Plot } from "components/drawings/plot";
import { Fx } from "components/drawings/fx";
import { getColor } from "colors";
import * as tf from '@tensorflow/tfjs';
import _ from "lodash";

import { InteractiveMLP } from './drawing_files/mlp';


const [annFxWidth, annFxHeight] = [1920, 750];
const WeightedSumStrChild = withDrawingScale(({
    annotFontSize, mathFontSize, weights, weightsName, values, valuesName,
    bias, biasName,
    rhs,
    lhs,
    weightColor,
    biasColor, 
}) => {
    const weightIds = weights.map(w => useId());
    const valueIds = values.map(w => useId());
    const biasId = useId();
    const biasNameId = useId();
    const weightNameId = useId();
    const valueNameId = useId();

    let weightColorTex = "\\" + weightColor;
    let biasColorTex = "\\" + biasColor;

    let s = '';
    for (let i = 0; i < weightIds.length; ++i) {
        let w = weights[i];
        let v = values[i];
        let wId = weightIds[i];
        let vId = valueIds[i];

        let prefix = i > 0 ? '~~+~~ ' : '';

        s += String.raw`${prefix}{${weightColorTex}{\cssId{${wId}}{${w}}}} \cdot \cssId{${vId}}{${v}}`;
    }
    if (bias !== null) {
        s += String.raw`~~+~~{${biasColorTex}{\cssId{${biasId}}{${bias}}}}`;
    }
    if (rhs !== null) {
        s += `~~=~~${rhs}`;
    }
    if (lhs !== null) {
        s = `${lhs}~~=~~${s}`;
    }
    s = <M>{s}</M>;

    const [arrows, setArrows] = React.useState([]);
    const [xMargin, yMargin] = [50, 0];
    const arrowStyleProps = {lineWidth: 10, anchorRadius: 75, marginTarget: 50};

    const [fxX, fxY] = [annFxWidth/2, annFxHeight/2];

    useEffect(() => {
        let _arrows = [];
        for (let i = 0; i < weightIds.length; ++i) {
            let w = weights[i];
            let v = values[i];
            let wId = weightIds[i];
            let vId = valueIds[i];

            if (weightsName !== null) {
                _arrows.push(
                    <AnnotArrow annot={`#${weightNameId}`} target={`#${wId}`} color={weightColor} {...{...arrowStyleProps, targetAlign: "bottom center", annotAlign: "top center"}} />,
                );
            }
            if (valuesName !== null) {
                _arrows.push(
                    <AnnotArrow annot={`#${valueNameId}`} target={`#${vId}`} {...{...arrowStyleProps, targetAlign: "top center", annotAlign: "bottom center"}} />,
                );
            }
        }
        if (biasName !== null) {
            _arrows.push(
                <AnnotArrow annot={`#${biasNameId}`} target={`#${biasId}`} color={biasColor} {...{...arrowStyleProps, targetAlign: "top center", annotAlign: "bottom center"}} />,
            );
        }
        setArrows(_arrows);
    }, []);

    return (
        <>
            { weightsName !== null ?
                <Annot x={fxX} y={annFxHeight - yMargin} fontSize={annotFontSize} color={weightColor} align="bottom center" id={weightNameId}>
                    <MD>{ weightsName }</MD>
                </Annot>
                : null
            }
            { valuesName !== null ?
                <Annot x={fxX - xMargin} y={yMargin} fontSize={annotFontSize} align="top right" id={valueNameId}>
                    <MD>{ valuesName }</MD>
                </Annot>
                : null
            }
            { biasName !== null ?
                <Annot x={annFxWidth - xMargin} y={yMargin} fontSize={annotFontSize} color={biasColor} align="top right" id={biasNameId}>
                    <MD>{ biasName }</MD>
                </Annot>
                : null
            }
            <Annot x={fxX} y={fxY} fontSize={mathFontSize} align="center center">
                { s }
            </Annot>
            { arrows.map((a, i) => <React.Fragment key={i}>{a}</React.Fragment>) }
        </>
    )
}, annFxWidth, annFxHeight)

export const WeightedSumStr = ({
    weights, weightsName, weightColor="orange",
    bias=null, biasName=null, biasColor="orange",
    values, valuesName=null,
    rhs=null, lhs=null,
    annotFontSize=100, mathFontSize=100
}) => {
    return (
        <Drawing left={0} right={annFxWidth} bottom={annFxHeight} top={0} noWatermark>
            {/** <DrawingGrid major={100} minor={50}/> **/}
            <WeightedSumStrChild
                weights={weights} weightsName={weightsName} weightColor={weightColor}
                values={values} valuesName={valuesName}
                bias={bias} biasName={biasName} biasColor={biasColor}
                rhs={rhs} lhs={lhs}
                annotFontSize={annotFontSize} mathFontSize={mathFontSize}/>
        </Drawing>
  );
};

export const WeightedSum = ({
    weights, weightsName=null, weightColor="orange",
    bias=null, biasName=null, biasColor="orange",
    values, valuesName=null,
    annotFontSize=100, mathFontSize=100
}) => {
    let wSum = 0;
    let weightsStr = [];
    let valuesStr = [];

    for (let i = 0; i < weights.length; ++i) {
        let wNum = weights[i];
        let vNum = values[i];

        let wStr = toLatexNumber(wNum);
        let vStr = toLatexNumber(vNum);

        wSum += wNum * vNum;

        if (wNum < 0 && i > 0) {
            wStr = `(${wStr})`;
        }
        if (vNum < 0) {
            vStr = `(${vStr})`;
        }

        weightsStr.push(wStr);
        valuesStr.push(vStr);
    }
    if (bias !== null) {
        wSum += bias;
        bias = toLatexNumber(bias);
    }

    let wSumStr = toLatexNumber(wSum);

    return (
        <WeightedSumStr weights={weightsStr} weightsName={weightsName}
                values={valuesStr} valuesName={valuesName}
                bias={bias} biasName={biasName}
                rhs={wSumStr}
                annotFontSize={annotFontSize} mathFontSize={mathFontSize}/>
  );
};

const _ReLU = ({}) => {
    const {xScale, yScale} = React.useContext(DrawingContext);
    return (
        <>
            <Fx fx={x => Math.max(0, x)} />
            <Accolade color="black" x1={xScale(-15)} x2={xScale(0)}
                y1={yScale(-2)} y2={yScale(-2)} height={yScale.metric(1)} width={xScale.metric(1)}
                strokeWidth={xScale.metric(0.1)}/>
        </>
    );
}

export const ReLU = ({}) => {
    const divStyle = {fontSize: "x-small", fontWeight: "bold", maxWidth: "8em", lineHeight: "1.0"};
    return (
        <Plot
            xLabel=<div style={divStyle}>Uitkomst van gewogen som</div>
        yLabel=<div style={divStyle}>Output van neuron</div>
        gridProps={{minor: 2}}>
            <_ReLU />
        </Plot>
    );
}

const RotatedShape = ({ x1, y1, x2, y2, children }) => {
  // Calculate the angle in radians, then convert to degrees
  const angleRad = Math.atan2(y2 - y1, x2 - x1);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Create the transform string
  const transform = `translate(${x1}, ${y1}) rotate(${angleDeg})`;

  return (
    <g transform={transform}>
      {children}
    </g>
  );
};


const _Accolade = ({
    x1, x2, y1, y2, height, strokeWidth,
    color="gray",
}, ref) => {
    const accoladeRef = React.useRef(null);

    color = getColor(color);
    const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const getAccoladeD = (width, height) => {
        return `M 0,0 c ${height},0 0,${-width/2} ${height},${-width/2} c ${-height},0 0,${-width/2} ${-height},${-width/2}`;
    };

    return (
        <g ref={ref}>
            <RotatedShape x1={x1} y1={y1} x2={x2} y2={y2}>
                <path ref={accoladeRef} d={getAccoladeD(width, height)}
                    transform="rotate(90)"
                    fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            </RotatedShape>
        </g>
    );
};

export const Accolade = React.forwardRef(_Accolade);

const SumNeuron = ({x, y, radius, color, activFunc}) => {
    const m = 0.4 * radius;
    const sW = 0.15 * radius;
    return (
        <>
            <circle cx={x} cy={y} r={radius} stroke={color} strokeWidth={sW} fill={getColor("near_white")}/>
            <path d={`M ${x},${y-radius+m} v ${2*radius - 2*m} M ${x-radius+m},${y} h ${2*radius - 2*m}`}
                stroke={color} strokeWidth={sW / 2} strokeLinecap="round"/>
            <CurvedTextCircle
                cx={x}
                cy={y}
                radius={radius*1.15}
                topText="Eriks"
                bottomText="Huizenprijsneuron"
                textProps={{
                    fontSize: '8px',
                    fontWeight: "bold",
                    fill: color,
                }}
            />
        </>
    );
};

export const EriksNeuron1 = ({}) => {
    return (
        <InteractiveMLP
            inputProps={[
                {value: 230, min: 0, max: 500, step: 10, name: "\\text{Opp}", unit: "\\si{m}^2"},
                {value: 5, min: 0, max: 100, step: 1, name: "\\text{Afst}", unit: "\\si{km}"},
            ]}
            outputProps={[
                {name: "\\text{Waarde}", unit: "\\si{euro}"},
            ]}
            weightProps={[
                [ // Layer 1
                    [ // Input 1
                        // Neuron 1
                        {value: 3000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                    ],
                    [ // Input 2
                        // Neuron 1
                        {value: -2500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                    ],
                ],
            ]}
            style={{
                weightFontSize: 10,
                layerSpacing: 100,
                outputLayerSpacing: 50,
                nodeSpacing: 60,
                nodeRadius: 25,
                nodeColor: getColor("gold"),
            }}
            outputActivation={x => x}
            NeuronComp={SumNeuron}
            annotWeights
        />
    );
};


const CurvedTextCircle = ({
  cx = 150,       // Center X
  cy = 150,       // Center Y
  radius = 100,   // Radius of the circle
  topText = "Top Curved Text",
  bottomText = "Bottom Curved Text",
  textProps = {}, // Optional text styling
}) => {
  const topPathId = useId();
  const bottomPathId = useId();

  // SVG arc paths for top and bottom text
  const topPath = describeArc(cx, cy, radius, -170, 170, true, true);
  const bottomPath = describeArc(cx, cy, radius, -10, 10, true, false);

  return (
    <g>
      <defs>
        <path id={topPathId} d={topPath} fill="none"/>
        <path id={bottomPathId} d={bottomPath} fill="none"/>
      </defs>

      <text {...textProps}>
        <textPath href={`#${topPathId}`} startOffset="50%" textAnchor="middle">
          {topText}
        </textPath>
      </text>

      <text {...textProps}>
        <textPath href={`#${bottomPathId}`} startOffset="50%" textAnchor="middle" alignmentBaseline="hanging">
          {bottomText}
        </textPath>
      </text>
  </g>
  );
};

// Helper: SVG Arc Path Generator
function describeArc(x, y, radius, startAngle, endAngle, isLargeArc, isSweep) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, isLargeArc ? "1" : "0", isSweep ? "1" : "0", end.x, end.y
  ].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
}



const SumActNeuron = ({x, y, radius, color, activFunc}) => {
    const m = 0.2 * radius;
    const sW = 0.15 * radius;

    const [plotD, setPlotD] = useState("");
    useEffect(() => {
        const plotLeft = x;
        const plotRight = x + radius;
        const dy = radius;
        const plotTop = y - dy;
        const plotBottom = y + dy;
        const plotNSamples = 51;
        const plotXStart = -10;
        const plotXEnd = 10;
        const plotYStart = -10;
        const plotYEnd = 10;
        const sampleIdxs = [...Array(plotNSamples + 1)].map((_, i) => i);
        const xs = sampleIdxs.map(i => i*(plotXEnd - plotXStart) / plotNSamples + plotXStart);

        const getSvgXY = (plotX, plotY) => {
            const svgX = (plotX - plotXStart) / (plotXEnd - plotXStart) * (plotRight - plotLeft) + plotLeft;
            const svgY = (plotY - plotYStart) / (plotYEnd - plotYStart) * (plotTop - plotBottom) + plotBottom;
            return [svgX, svgY];
        };
        const getLineCommand = (plotX, plotY) => {
            const [svgX, svgY] = getSvgXY(plotX, plotY);
            return `L ${svgX} ${svgY}`;
        };

        tf.ready().then(() => {
            tf.tidy(() => {
                activFunc(tf.tensor(xs)).data().then(
                    ys => {
                        ys = Array.from(ys);
                        let dStr = '';
                        let useMove = true;
                        _.zip(xs, ys).forEach(xy => {
                            const [plotX, plotY] = xy;
                            const [svgX, svgY] = getSvgXY(plotX, plotY);
                            if (Math.sqrt(Math.pow(svgX - x, 2) + Math.pow(svgY - y, 2)) > radius) {
                                // Outside circle
                                useMove = true;
                                return;
                            }
                            if (useMove) {
                                dStr += `M ${svgX} ${svgY} `;
                                useMove = false;
                            } else {
                                dStr += `L ${svgX} ${svgY} `;
                                useMove = false;
                            }
                        });
                        setPlotD(dStr);
                    }
                );
            });
        });
    }, [m, radius, x, y, activFunc]);

    const plusX = x - (radius / 2);
    const plusSize = radius - 2*m;

    return (
        <>
            {/**<path d={`M ${x},${y-radius} v ${2*radius}`} stroke={color} strokeWidth={sW} strokeLinecap="round"/>**/}
            <circle cx={x} cy={y} r={radius} fill={getColor("white")}/>
            {
                /** Gridlines **/
                [...Array(5)].map((_, i) => {
                    if (i === 0) return null;
                    const dx1 = i / 4 * radius;
                    const dy1 = radius * Math.sin(Math.acos(dx1 / radius));
                    let dStr = `M ${x + dx1},${y - dy1} v ${2*dy1} `;

                    const dy2 = radius - i / 4 * radius;
                    const dx2 = radius * Math.cos(Math.asin(dy2 / radius));
                    dStr += `M ${x},${y - dy2} h ${dx2} `;
                    dStr += `M ${x},${y + dy2} h ${dx2} `;
                    return (
                        <path key={`grid-${i}`} d={dStr} stroke={getColor("light_gray")} strokeWidth="1px"/>
                    );
                })
            }
            <path d={plotD} fill="none" stroke={color} strokeWidth={sW / 2} strokeLinecap="butt" strokeLinejoin="round"/>
            <path d={`M ${plusX},${y - plusSize / 2} v ${plusSize} M ${plusX - plusSize / 2},${y} h ${plusSize}`}
                stroke={color} strokeWidth={sW / 2} strokeLinecap="round"/>
            <circle cx={x} cy={y} r={radius} stroke={color} strokeWidth={sW} fill="none"/>
            <CurvedTextCircle
                cx={x}
                cy={y}
                radius={radius*1.15}
                topText="Eriks"
                bottomText="Huizenprijsneuron 2.0"
                textProps={{
                    fontSize: '8px',
                    fontWeight: "bold",
                    fill: color,
                }}
            />
        </>
    );
};

export const EriksNeuron2 = ({}) => {
    return (
        <InteractiveMLP
            inputProps={[
                {value: 70, min: 0, max: 500, step: 10, name: "\\text{Opp}", unit: "\\si{m}^2"},
                {value: 100, min: 0, max: 100, step: 1, name: "\\text{Afst}", unit: "\\si{km}"},
            ]}
            outputProps={[
                {name: "\\text{Waarde}", unit: "\\si{euro}"},
            ]}
            weightProps={[
                [ // Layer 1
                    [ // Input 1
                        // Neuron 1
                        {value: 3000, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                    ],
                    [ // Input 2
                        // Neuron 1
                        {value: -2500, min: -5000, max: 5000, step: 100, name: "Gewicht"},
                    ],
                ],
            ]}
            style={{
                weightFontSize: 10,
                layerSpacing: 100,
                outputLayerSpacing: 50,
                nodeSpacing: 75,
                nodeRadius: 25,
                nodeColor: getColor("blue"),
                edgeColor: getColor("light_gray"),
                weightColor: "blue",
            }}
            outputActivation={x => tf.tidy(() => tf.relu(x))}
            NeuronComp={SumActNeuron}
            annotWeights
        />
    );
};
