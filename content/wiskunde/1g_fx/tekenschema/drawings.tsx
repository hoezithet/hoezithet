import React from "react";
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
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
