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
import { getColor } from "colors";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';
import { Katex } from 'components/katex';
import { MathJax } from "components/mathjax";
import { toComma } from "../rico/drawings";


export const _NulpuntGraph1G = ({
    m, q,
}) => {
    const fx = x => m*x + q;
    const zero = -q/m;

    const {xScale, yScale} = React.useContext(DrawingContext);
    const annotX = m > 0 ? 10 : -10;
    const annotY = -10;
    const annotAlign = (
        m > 0 ? "bottom right"
        : "bottom left"
    );
    const annotPadding = xScale.metric(0.5);
    const idQm = useId();
    const idZero = useId();
    const [arrows, setArrows] = React.useState([]);

    const mStr = toComma(m);

    React.useEffect(() => {
        setArrows(
            <AnnotArrow annot={`#${idQm}`} target={`#${idZero}`} anchorRadius={xScale.metric(3)} targetAlign="bottom center" annotAlign={m > 0 ? "bottom left" : "center right"}/>,
        );
    }, [m, q, idQm, idZero]);

    return (
        <>
            <Fx fx={fx} />
            { m !== 0 ?
              <>
              <Annot x={xScale(zero)} y={yScale(0)} align="top center" textPadding={xScale.metric(0.5)} showBackground backgroundOpacity={0.5} Wrapper={MathJax}>
                {String.raw`\htmlId{${idZero}}{\orange{${toComma(zero)}}}`}
              </Annot>
              <circle cx={xScale(zero)} cy={yScale(0)} r={xScale.metric(0.2)} fill={getColor("orange")} />
              { arrows }
              <Annot x={xScale(annotX)} y={yScale(annotY)} align={annotAlign} textPadding={0} Wrapper={MathJax}>
                {String.raw`
                  \begin{aligned}
                  \frac{-q}{m} &= \frac{${toComma(-q)}}{${mStr}}\\
                               &= \htmlId{${idQm}}{\orange{${toComma(zero)}}}
                  \end{aligned}
                  `}
              </Annot>
             </>
             : null }
        </>
  );
};

export const NulpuntGraph1G = (props) => <Plot gridProps={{major: 1, color: "light_gray", opacity: 0.5}}><_NulpuntGraph1G {...props} /></Plot>;

export const InteractiveNulpuntGraph1G = ({
    m=1, q=0, mSlider=false, qSlider=false,
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
            <NulpuntGraph1G m={m} q={q}/>
            <Box sx={{ width: 400 }}>
                <Stack direction="column" spacing={2} alignItems="center">
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
                </Stack>
            </Box>
        </Stack>
    );
};
