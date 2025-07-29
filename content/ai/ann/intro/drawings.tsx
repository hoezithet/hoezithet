import React from "react";
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

    React.useEffect(() => {
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
                <Annot x={fxX} y={annFxHeight - yMargin} fontSize={annotFontSize} color={weightColor} color={weightColor} align="bottom center" id={weightNameId}>
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
    return (
        <Plot>
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
