import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';
import Markdown from "components/markdown";


export const _Graph1G = ({
    m, q,
}) => {
    const fx = x => m*x + q;

    const {xScale, yScale} = React.useContext(DrawingContext);
    const annotX = 1;
    const annotY = Math.min(Math.max(fx(annotX), -8), 8);
    const annotAlign = (
        m > 0 ? "top left"
        : "bottom left"
    );
    const annotPadding = xScale.metric(0.5);

    const mStr = toComma(m);
    const qStr = toComma(`${q === 0 && m !== 0 ? "" : (
        q >= 0 && m !== 0 ? "+" + q : q
    )}`);


    return (
        <>
            <Fx fx={fx} />
            <Annot x={xScale(annotX)} y={yScale(annotY)} align={annotAlign} textPadding={annotPadding} showBackground backgroundOpacity={0.5}>
                {String.raw`$y = ${m !== 0 ? (
                    m === 1 ? 'x' : (
                        m === -1 ? '-x' : `${mStr}\\cdot x` 
                    )
                ): ""}${qStr}$`}
            </Annot>
        </>
  );
};

const toComma = s => `${s}`.replace('.', '{,}');

export const Graph1G = (props) => <Plot><_Graph1G {...props} /></Plot>;

export const InteractGraph1G = ({
    m, q, mSlider=false, qSlider=false,
}) => {
    let setM;
    let setQ;
    [m, setM] = React.useState(m);
    [q, setQ] = React.useState(q);

    const handleChangeM = (event, newValue) => {
        setM(newValue);
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
        <Stack alignItems="center">
            <Graph1G m={m} q={q}/>
            <Box sx={{ width: 400 }}>
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
            </Box>
        </Stack>
    );
};
