import React from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow, useAnnotArrow } from "components/drawings/annotArrow";
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import { getColor } from "colors";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';
import Markdown from "components/markdown";
import _range from "lodash/range";
import { Katex } from 'components/katex';


const toComma = s => {
  if (typeof s === 'number' && !Number.isInteger(s)) {
      s = s.toFixed(2);
      if (Math.floor(s) == s) {
          s = Math.floor(s)
      }
  }
  return `${s}`.replace('.', ',');
};

export const getVoorschrift1GStr = (m, q, useY=false) => {
    const mStr = toComma(m);
    const qStr = toComma(`${q === 0 && m !== 0 ? "" : (
        q >= 0 && m !== 0 ? "+" + q : q
        )}`);
    return String.raw`${useY ? "y" : "f(x)"} = ${
          m !== 0 ?
          (m === 1 ? 'x'
            : (m === -1 ? '-x'
               : `${mStr}\\cdot x`))
               : ""}${qStr}`;
};

export const Voorschrift1G = ({m, q, useY=false, ...props}) => {
  
    return (
      <Annot {...props} Wrapper={Katex}>
          { getVoorschrift1GStr(m, q, useY) }
      </Annot>
    );
}

const valToMark = x => ({
    value: x,
    label: `${toComma(x)}`
});

export const FxValueSlider = ({
    x, m, q, xMin, xMax, xStep, markMin, markMax, markStep, extraMarks=[]
}) => {
    let setX;
    [x, setX] = React.useState(x);

    const handleChangeX = (event, newValue) => {
        if (newValue < xMin || newValue > xMax) {
            return;
        }
        setX(newValue);
    };

    const marks = _range(markMin, markMax + markStep, markStep).map(valToMark)
    extraMarks.forEach(x => marks.push(valToMark(x)));

    const sliderProps = {
        step: xStep,
        min: markMin,
        max: markMax,
        marks: marks,
        getAriaValueText: x => `${toComma(x)}`,
    };

    const xComma = String.raw`{\orange{${toComma(x)}}}`;
    const mComma = toComma(m);
    const qComma = toComma(q);
    const y = m*x + q;
    const yComma = toComma(y);
    const xBr = x < 0 ? `(${xComma})` : xComma;

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <Katex display>{ String.raw`
                  \begin{aligned}
                    f(${xComma}) &= ${mComma}\cdot ${xBr} ${q < 0 ? "" : "+"} ${qComma}\\
                                 &= ${yComma}\\
                                 &${y > 0 ? "\\gt" : "\\lt"} 0
                  \end{aligned}
                 ` }</Katex>
            </Grid>
            <Grid item xs={3} textAlign="left">
                <Katex>{ String.raw`x = ${xComma}` }</Katex>
            </Grid>
            <Grid item xs={9}>
                 <Slider aria-label="x-waarde" value={x} onChange={handleChangeX} {...sliderProps} />
            </Grid>
        </Grid>
    );
};


export const _NulpuntGraph1G = ({
    m, q, nSignId, pSignId, zeroId, showSigns=false, showFx=false
}) => {
    const fx = x => m*x + q;
    const zero = -q/m;

    const {xScale, yScale, width, height} = React.useContext(DrawingContext);
    const annotX = m > 0 ? 10 : -10;
    const annotY = -10;
    const annotAlign = (
        m > 0 ? "bottom right"
        : "bottom left"
    );
    const annotPadding = xScale.metric(0.5);
    const mStr = toComma(m);
    const signRegionOpacity = 0.3;

    const sectTopX = xScale((yScale.inverse(0)-q)/m);
    const sectLeftY = yScale(fx(xScale.inverse(0)));
    const sectBottomX = xScale((yScale.inverse(height)-q)/m);
    const sectRightY = yScale(fx(xScale.inverse(width)));

    const px1 = m <= 0 ? 0 : width;
    const py1 = m !== 0 ? 0 : yScale(q);
    const px2 = m !== 0 ? xScale((yScale.inverse(0)-q)/m) : width;
    const px3 = m !== 0 ? xScale(-q/m) : width;
    const py3 = yScale(0);
    const px4 = m <= 0 ? 0 : width;

    const nx1 = m <= 0 ? width : 0;
    const ny1 = m !== 0 ? height : yScale(q);
    const nx2 = m !== 0 ? xScale((yScale.inverse(height)-q)/m) : 0;
    const nx3 = m !== 0 ? xScale(-q/m) : 0;
    const ny3 = yScale(0);
    const nx4 = m <= 0 ? width : 0;

    const signSize = yScale.metric(3);
    const pSignX = m === 0 ? xScale(0) : (xScale(zero)/3 + (m < 0 ? 0 : width*2/3));
    const pSignY = m === 0 ? yScale(q/2) : (yScale(0)*2/3 + Math.max(0, m < 0 ? sectLeftY : sectRightY)/3);

    const nSignX = m === 0 ? xScale(0) : (xScale(zero)/3 + (m > 0 ? 0 : width*2/3));
    const nSignY = m === 0 ? yScale(q/2) : (yScale(0)*2/3 + Math.min(height, m > 0 ? sectLeftY : sectRightY)/3);

    const zeroX = xScale(zero);
    const zeroY = yScale(0);

    return (
        <>
            {
              (q > 0 || m !== 0) && showSigns ?
              <>
                <path d={`M ${px1},${py1} H ${px2} L ${px3},${py3} H ${px4} Z`} fill={getColor("green")} fillOpacity={signRegionOpacity}/>
                { pSignX > 0 && pSignX < width ?
                    <Annot x={pSignX} y={pSignY} align="center center" color="green" fontSize={signSize} Wrapper={Katex}>
                    {`\\htmlId{${pSignId}}{+}`}
                    </Annot>
                    : null }
              </>
              : null
            }
            {
              (q < 0 || m !== 0) && showSigns ?
              <>
                <path d={`M ${nx1},${ny1} H ${nx2} L ${nx3},${ny3} H ${nx4} Z`} fill={getColor("red")} fillOpacity={signRegionOpacity}/>
                { nSignX > 0 && nSignX < width ?
                    <Annot x={nSignX} y={nSignY} align="center center" color="red" fontSize={signSize} Wrapper={Katex}>
                    {`\\htmlId{${nSignId}}{-}`}
                    </Annot>
                    : null }
              </>
              : null
            }
            <Fx fx={fx} />
            { m !== 0 && (zeroX > 0 && zeroX < width) ?
              <>
              <Annot x={zeroX} y={zeroY} align="top center" textPadding={xScale.metric(0.5)} showBackground backgroundOpacity={0.8} Wrapper={Katex}>
                {String.raw`\text{Nulpunt }(\htmlId{${zeroId}}{\orange{${toComma(zero)}}}; 0)`}
              </Annot>
              <circle cx={xScale(zero)} cy={yScale(0)} r={xScale.metric(0.2)} fill={getColor("orange")} />
             </>
             : null }
            { showFx ? <Voorschrift1G m={m} q={q} x={m > 0 ? width/20 : width*19/20} y={height/20} align={ m > 0 ? "top left" : "top right"} /> : null }
        </>
  );
};

export const NulpuntGraph1G = (props) => <Plot><_NulpuntGraph1G {...props} /></Plot>;

export const FxTable = ({xs, ys}) => {
    const Table = styled('table')({
        borderCollapse: "collapse",
        "& thead tr th:first-child, td:first-child": {
            borderRight: `1px solid ${getColor("dark_gray")}`,
        },
        "& tbody tr:first-child": {
            borderBottom: `1px solid ${getColor("dark_gray")}`,
        }
    });

    return (
        <Table>
          <thead>
            <tr>
                <th>
                    <Katex>x</Katex>
                </th>
              {
                  xs.map((x, i) => <th key={i}>{ x }</th>)
              }
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>
                  <Katex>f(x)</Katex>
                </td>
              {
                  ys.map((y, i) => <td key={i}>{ y }</td>)
              }
            </tr>
          </tbody>
        </Table>
    );
};

export const Tekenschema1G = ({m, q, nSignId=null, pSignId=null, zeroId=null, useColors=false}) => {
    const plus = `\\htmlId{${pSignId}}{` + (useColors ? `\\green{+}` : `+`) + `}`;
    const minus = `\\htmlId{${nSignId}}{` + (useColors ? `\\red{-}` : `-`) + `}`;
    const zero = `0`;
    const zeroStr = toComma(-q/m);
    const zeroValue = `\\htmlId{${zeroId}}{` + (useColors ? `\\orange{${zeroStr}}` : zeroStr) + `}`;

    const xs = [
        `-\\infty`,
        ...(
            m !== 0 ?
            [
                null,
                zeroValue,
                null
            ]
            : [
                null
            ]
        ),
        `+\\infty`
    ].map(x => x !== null ? <Katex>{x}</Katex> : null);

    const ys = [
        '',
        ...(
            m !== 0 ?
            [
                m > 0 ? minus : plus,
                zero,
                m < 0 ? minus : plus
            ]
            : [
                q > 0 ? plus : (q < 0 ? minus : zero)
            ]
        ),
    ].map(x => <Katex>{x}</Katex>);

    return <FxTable xs={xs} ys={ys}/>;
}

export const InteractiveTekenschema = ({
    m=1, q=0, mSlider=false, qSlider=false,
    checkM= m => true,
}) => {
    let setM;
    let setQ;
    [m, setM] = React.useState(m);
    [q, setQ] = React.useState(q);
    const nSignIdGraph = useId();
    const pSignIdGraph = useId();
    const nSignIdTable = useId();
    const pSignIdTable = useId();
    const zeroGraphId = useId();
    const zeroTableId = useId();
    const arrowProps = {
        anchorRadius: 100,
        annotAlign: "bottom center",
        margin: 20,
        color: "dark_gray"
    };
    const nArrow = useAnnotArrow({
        annot: `#${nSignIdGraph}`, target: `#${nSignIdTable}`,
        ...arrowProps,
        color: "red",
    }, [m, q]);
    const pArrow = useAnnotArrow({
        annot: `#${pSignIdGraph}`, target: `#${pSignIdTable}`,
        ...arrowProps,
        color: "green",
    }, [m, q]);
    const zeroArrow = useAnnotArrow({
        annot: `#${zeroGraphId}`, target: `#${zeroTableId}`,
        ...arrowProps,
        margin: 10,
        color: "orange",
    }, [m, q]);

    const handleChangeM = (event, newValue) => {
        if (checkM(newValue)) {
            setM(newValue);
        }
    };
    const handleChangeQ = (event, newValue) => {
        setQ(newValue);
    };

    const sliderProps = {
        step: 0.01,
        min: -15,
        max: 15,
        marks: _range(-15, 20, 5).map(valToMark),
        getAriaValueText: x => `${toComma(x)}`,
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={8} item overflow="hidden">
                <Stack spacing={1}>
                   <Plot>
                        <_NulpuntGraph1G m={m} q={q} nSignId={nSignIdGraph} pSignId={pSignIdGraph} zeroId={zeroGraphId} showSigns showFx />
                    </Plot>
                    <Tekenschema1G m={m} q={q} nSignId={nSignIdTable} pSignId={pSignIdTable} zeroId={zeroTableId} useColors/>
                    { nArrow }
                    { pArrow }
                    { zeroArrow }
                </Stack>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
                { mSlider ?
                    <>
                        <Katex>{ `m = ${toComma(m)}` }</Katex>
                        <Slider aria-label="richtingscoëfficiënt" value={m} onChange={handleChangeM} {...sliderProps} />
                    </>
                    : null }
                { qSlider ?
                    <>
                        <Katex>{ `q = ${toComma(q)}` }</Katex>
                        <Slider aria-label="snijpunt y-as" value={q} onChange={handleChangeQ} {...sliderProps} />
                    </>
                    : null }
            </Grid>
        </Grid>
    );
};
