import React from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
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


const toComma = s => {
  if (typeof s === 'number' && !Number.isInteger(s)) {
      s = s.toFixed(2);
      if (Math.floor(s) == s) {
          s = Math.floor(s)
      }
  }
  return `${s}`.replace('.', '{,}');
};

const Voorschrift1G = ({m, q}) => {
    const mStr = toComma(m);
    const qStr = toComma(`${q === 0 && m !== 0 ? "" : (
        q >= 0 && m !== 0 ? "+" + q : q
    )}`);
    return (
      <Markdown>
        { String.raw`$f(x) = ${
          m !== 0 ?
          (m === 1 ? 'x'
            : (m === -1 ? '-x'
               : `${mStr}\\cdot x`))
          : ""}${qStr}$` }
      </Markdown>
    );
}

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

    const valToMark = x => ({
        value: x,
        label: `${toComma(x)}`
    });

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
                <Markdown>{ String.raw`$$
                  \begin{aligned}
                    f(${xComma}) &= ${mComma}\cdot ${xBr} ${q < 0 ? "" : "+"} ${qComma}\\
                                 &= ${yComma}\\
                                 &${y > 0 ? "\\gt" : "\\lt"} 0
                  \end{aligned}
                 $$` }</Markdown>
            </Grid>
            <Grid item xs={3} textAlign="left">
                <Markdown>{ String.raw`$x = ${xComma}$` }</Markdown>
            </Grid>
            <Grid item xs={9}>
                 <Slider aria-label="x-waarde" value={x} onChange={handleChangeX} {...sliderProps} />
            </Grid>
        </Grid>
    );
};


export const _NulpuntGraph1G = ({
    m, q, nSignId, pSignId, zeroId
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
    const pSignX = xScale(zero)/3 + (m < 0 ? 0 : width*2/3);
    const pSignY = yScale(0)*2/3 + Math.max(0, m < 0 ? sectLeftY : sectRightY)/3;

    const nSignX = xScale(zero)/3 + (m > 0 ? 0 : width*2/3);
    const nSignY = yScale(0)*2/3 + Math.min(height, m > 0 ? sectLeftY : sectRightY)/3;

    return (
        <>
            {
              (q > 0 || m !== 0) ?
              <>
                <path d={`M ${px1},${py1} H ${px2} L ${px3},${py3} H ${px4} Z`} fill={getColor("green")} fillOpacity={signRegionOpacity}/>
                <Annot x={pSignX} y={pSignY} align="center center" color="green" fontSize={signSize}>
                {`$\\htmlId{${pSignId}}{+}$`}
                </Annot>
              </>
              : null
            }
            {
              (q < 0 || m !== 0) ?
              <>
                <path d={`M ${nx1},${ny1} H ${nx2} L ${nx3},${ny3} H ${nx4} Z`} fill={getColor("red")} fillOpacity={signRegionOpacity}/>
                <Annot x={nSignX} y={nSignY} align="center center" color="red" fontSize={signSize}>
                {`$\\htmlId{${nSignId}}{-}$`}
                </Annot>
              </>
              : null
            }
            <Fx fx={fx} />
            { m !== 0 ?
              <>
              <Annot x={xScale(zero)} y={yScale(0)} align="top center" textPadding={xScale.metric(0.5)} showBackground backgroundOpacity={0.5}>
                {String.raw`Nulpunt $(\htmlId{${zeroId}}{${toComma(zero)}}; 0)$`}
              </Annot>
              <circle cx={xScale(zero)} cy={yScale(0)} r={xScale.metric(0.2)} fill={getColor("orange")} />
             </>
             : null }
        </>
  );
};

export const NulpuntGraph1G = (props) => <Plot><_NulpuntGraph1G {...props} /></Plot>;

export const Tekenschema1G = ({m, q, nSignId, pSignId, zeroId}) => {
    return (
        <table>
          <tr>
            <th><Markdown>{ `$x$` }</Markdown></th>
            <th><Markdown>{ `$-\\infty$` }</Markdown></th>
            { m !== 0 ?
                <>
                  <th></th>
                  <th><Markdown>{ `$\\htmlId{${zeroId}}{${toComma(-q/m)}}$` }</Markdown></th>
                  <th></th>
                </>
                : <th></th> }
            <th><Markdown>{ `$+\\infty$` }</Markdown></th>
          </tr>
          <tr>
            <td><Markdown>{ `$f(x)$` }</Markdown></td>
            <td></td>
            { m !== 0 ?
              <>
                <td><Markdown>{ m > 0 ? `$\\htmlId{${nSignId}}{-}$` : `$\\htmlId{${pSignId}}{+}$` }</Markdown></td>
                <td><Markdown>{ `$0$` }</Markdown></td>
                <td><Markdown>{ m < 0 ? `$\\htmlId{${nSignId}}{-}$` : `$\\htmlId{${pSignId}}{+}$` }</Markdown></td>
              </>
              :
              <>
                <td><Markdown>{ q > 0 ? `$\\htmlId{${pSignId}}{+}$` : (q < 0 ? `$\\htmlId{${nSignId}}{-}$` : `$0$`) }</Markdown></td>
              </> }
            <td></td>
          </tr>
        </table>
    );
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
    const nArrow = useAnnotArrow({annot: `#${nSignIdGraph}`, target: `#${nSignIdTable}`});
    const pArrow = useAnnotArrow({annot: `#${pSignIdGraph}`, target: `#${pSignIdTable}`});

    const handleChangeM = (event, newValue) => {
        if (checkM(newValue)) {
            setM(newValue);
        }
    };
    const handleChangeQ = (event, newValue) => {
        setQ(newValue);
    };

    const sliderProps = {
        step: 0.1,
        min: -10,
        max: 10
    };

    return (
        <Stack alignItems="center" spacing={2} style={{position: "relative"}}>
            <Paper sx={{ width: 400, p: 2 }}>
                <Markdown>{"Kies $m$ en $q$:"}</Markdown>
                <Stack direction="column" spacing={2} alignItems="center">
                { mSlider ?
                    <>
                        <Markdown>{ `$m = ${toComma(m)}$` }</Markdown>
                        <Slider aria-label="richtingscoëfficiënt" value={m} onChange={handleChangeM} {...sliderProps} />
                    </>
                    : null }
                { qSlider ?
                    <>
                        <Markdown>{ `$q = ${toComma(q)}$` }</Markdown>
                        <Slider aria-label="snijpunt y-as" value={q} onChange={handleChangeQ} {...sliderProps} />
                    </>
                    : null }
                </Stack>
            </Paper>
            <Voorschrift1G m={m} q={q} />
            <NulpuntGraph1G m={m} q={q} nSignId={nSignIdGraph} pSignId={pSignIdGraph}/>
            <Tekenschema1G m={m} q={q} nSignId={nSignIdGraph} pSignId={pSignIdGraph}/>
            { nArrow }
            { pArrow }
        </Stack>
    );
};
