import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { useAnnotArrow } from "components/drawings/annotArrow";
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import { getColor } from "colors";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';
import Markdown from "components/markdown";
import { Katex } from 'components/katex';
import { MathJax } from "components/mathjax";


const getFx = (m, q) => x => m*x + q;

const toComma = s => {
    if (typeof s === 'number' && !Number.isInteger(s)) {
        s = s.toFixed(2);
        if (Math.floor(s) == s) {
            s = Math.floor(s)
        }
    }
    return `${s}`.replace('.', '{,}');
};

const DiffQuotPoints = ({
    m, q,
    p1, p2, r=0.2, fill="orange", pFill="blue"
}) => {
    const fx = getFx(m, q);

    const annotX = 10;
    const annotY = Math.min(Math.max(fx(annotX), -8), 8);
    const annotAlign = (
        m < 0 ? "top right"
        : "bottom right"
    );

    const mStr = toComma(m);
    const qStr = toComma(`${q === 0 && m !== 0 ? "" : (
        q >= 0 && m !== 0 ? "+" + q : q
    )}`);


    const {xScale, yScale} = React.useContext(DrawingContext);
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const tellerId = useId();
    const noemerId = useId();
    const dYAccolId = useId();
    const dXAccolId = useId();
    const ricoId = useId();
    const fracRicoId = useId();

    const [x1Px, y1Px] = [xScale(x1), yScale(y1)];
    const [x2Px, y2Px] = [xScale(x2), yScale(y2)];
    const [x1PxAnnot, y1PxAnnot] = [x1Px, y1Px];
    const [x2PxAnnot, y2PxAnnot] = [x2Px, y2Px];
    const rAngSignSizePx = xScale.metric(0.3);
    const rAngSignMarginPx = xScale.metric(0.2);
    const rPx = yScale.metric(r);
    pFill = getColor(pFill);
    const annotPadding = xScale.metric(0.2);

    const fracAnnotPadding = xScale.metric(0.2);
    const fracAnnotMargin = xScale.metric(2);
    const fracAnnotX = Math.min(Math.max(x2Px + fracAnnotMargin, xScale(-10)), xScale(7));
    const fracAnnotY = Math.min(Math.max(y1Px + fracAnnotMargin * (m >= 0 ? 1 : -1), yScale(10)), yScale(-10));

    const accolPadding = xScale.metric(1);
    const coordFontSizePx = yScale.metric(0.5);
    const coordColor = pFill;
    const accolAnnotProps = {
        showBackground: true,
        Wrapper: MathJax,
    };
    const arrowDeps = [x1Px, y1Px, x2Px, y2Px];
    const arrowTeller = useAnnotArrow({
        annot: `#${dXAccolId}`,
        target: `#${noemerId}`,
        targetAlign: "bottom left",
        annotAlign: "center right"
    }, arrowDeps);
    const arrowNoemer = useAnnotArrow({
        annot: `#${dYAccolId}`,
        target: `#${tellerId}`,
        targetAlign: "top right",
        annotAlign: "bottom center"
    }, arrowDeps);

    const xAccHeight = x2Px - x1Px;

    return (
        <>
            <Fx fx={fx} color={pFill} />
            <path d={`M ${x1Px} ${y1Px} L ${x2Px} ${y2Px} L ${x2Px} ${y1Px} Z`} fill={getColor(fill, 0.5)} stroke={getColor(fill)}/>
            <path d={`M ${x2Px - rAngSignMarginPx - rAngSignSizePx} ${y1Px - rAngSignMarginPx * (m >= 0 ? 1 : -1)} h ${rAngSignSizePx} v ${-rAngSignSizePx * (m >= 0 ? 1 : -1)}`} fill="none" stroke={getColor(fill)}/>
            <circle cx={x1Px} cy={y1Px} r={rPx} fill={pFill} />
            <circle cx={x2Px} cy={y2Px} r={rPx} fill={pFill} />
            <Annot x={x1PxAnnot} y={y1PxAnnot} align={annotAlign} textPadding={annotPadding} fontSize={coordFontSizePx} color={coordColor} showBackground Wrapper={Katex}>
                {String.raw`A~(${toComma(x1)}; ${toComma(y1)})`}
            </Annot>
            <Annot x={x2PxAnnot} y={y2PxAnnot} align={annotAlign} textPadding={annotPadding} fontSize={coordFontSizePx} color={coordColor} showBackground Wrapper={Katex}>
                {String.raw`B~(${toComma(x2)}; ${toComma(y2)})`}
            </Annot>
            <TextAccolade color={pFill} x1={x2Px + accolPadding} x2={x2Px}
                y={y1Px} height={y1Px - y2Px} width={xScale.metric(1)}
                strokeWidth={xScale.metric(0.1)} annotProps={accolAnnotProps}>
                {String.raw`\htmlId{${dYAccolId}}{${toComma(y2 - y1)}}`}
            </TextAccolade>
            <g transform={`translate(${x1Px + (m >= 0 ? 0 : xAccHeight)},${y1Px}) rotate(${m >= 0 ? 90 : -90})`}>
                <TextAccolade color={pFill} x1={accolPadding} x2={0} y={0}
                    height={xAccHeight} width={xScale.metric(1)}
                    strokeWidth={xScale.metric(0.1)} flipText={m >= 0} annotProps={accolAnnotProps}>
                    {String.raw`\htmlId{${dXAccolId}}{${toComma(x2 - x1)}}`}
                </TextAccolade>
            </g>
            <Annot x={fracAnnotX} y={fracAnnotY} align={m >= 0 ? "top left" : "bottom left"} textPadding={fracAnnotPadding} showBackground Wrapper={Katex}>
                {String.raw`\frac{\htmlId{${tellerId}}{${toComma(y2 - y1)}}}{\htmlId{${noemerId}}{${x2 - x1 === 1 ? "\\cancel{" + toComma(x2 - x1) + "}" : toComma(x2 - x1)}}} = \htmlId{${fracRicoId}}{${toComma((y2 - y1)/(x2 - x1))}}`}
            </Annot>
            { arrowTeller }
            { arrowNoemer }
        </>
    );
};


export const InteractDiffQuotPoints = ({
    m, q, x1, x2 = null, x2Func = null,
    mSlider=false, qSlider=false,
    p1Slider=false, p2Slider=false
}) => {
    let setM, setQ, setX1, setX2;

    [m, setM] = React.useState(m);
    [q, setQ] = React.useState(q);
    [x1, setX1] = React.useState(x1);
    [x2, setX2] = React.useState(x2);

    if (x2Func !== null) {
        x2 = x2Func(x1);
    }

    const handleChangeM = (event, newValue) => {
        setM(newValue);
    };
    const handleChangeQ = (event, newValue) => {
        setQ(newValue);
    };
    const handleChangeX1 = (event, newValue) => {
        if (newValue >= x2) {
            return;
        }
        setX1(newValue);
    };
    const handleChangeX2 = (event, newValue) => {
        if (newValue <= x1) {
            return;
        }
        setX2(newValue);
    };

    const sliderProps = {
        step: 0.1,
        min: -10,
        max: 10
    };

    const fx = getFx(m, q);
    let [y1, y2] = [fx(x1), fx(x2)];
    if (!Number.isInteger(y1)) {
        y1 = y1.toFixed(2);
    }
    if (!Number.isInteger(y2)) {
        y2 = y2.toFixed(2);
    }

    return (
        <Stack alignItems="center">
            <Plot gridProps={{major: 1, color: "light_gray", opacity: 0.5}}>
                <DiffQuotPoints m={m} q={q} p1={[x1, y1]} p2={[x2, y2]} />
            </Plot>
            <Box sx={{ width: 400 }}>
                <Stack direction="column" spacing={2} alignItems="center">
                { p1Slider ?
                    <>
                        <Katex>{ `x_1 = ${toComma(x1)}` }</Katex>
                        <Slider aria-label="x1" value={x1} onChange={handleChangeX1} {...sliderProps} />
                    </>
                    : null }
                { p2Slider ?
                    <>
                        <Katex>{ `x_2 = ${toComma(x2)}` }</Katex>
                        <Slider aria-label="x2" value={x2} onChange={handleChangeX2} {...sliderProps} />
                    </>
                    : null }
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


const _TextAccolade = ({
    x1, x2=null, y, flipText=false, hText=false, width, height, strokeWidth, fontSizePx=null,
    color="gray", children, annotProps
}, ref) => {
    /**
     * x1: Start of the dashed line
     * x2: End of the dashed line
     * y: Bottom of the accolade
     * width: width of the accolade (excluding text and dashed lines)
     * height: height of the accolade
     **/
    const accoladeRef = React.useRef(null);
    const line1Ref = React.useRef(null);
    const line2Ref = React.useRef(null);
    const noteRef = React.useRef(null);

    color = getColor(color);

    fontSizePx = fontSizePx !== null ? fontSizePx : width*2/3;
    x2 = x2 === null ? x1 : x2;
    const dashArray = `4,4`;

    const getAccoladeD = (width, height) => {
        return `M 0,0 c ${width},0 0,${-height/2} ${width},${-height/2} c ${-width},0 0,${-height/2} ${-width},${-height/2}`;
    };

    const getNoteTransform = (width, height) => {
        return `translate(${width + (flipText && !hText ? 3*fontSizePx : 0) + (hText ? width : 0)},${-height/2}) rotate(${(flipText ? -90 : 90) + (hText ? 90 : 0)})`;
    };

    return (
        <g ref={ref}>
            <g transform={`translate(${x1},${y})`}>
                <path ref={line1Ref} stroke={color} strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M ${0},${-height} H ${x2 - x1}`} />
                <path ref={line2Ref} stroke={color} strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={dashArray}
                    d={`M ${0},${0} H ${x2 - x1}`} />
                <g transform={x1 >= x2 ? "" : `translate(${0},${-height}) rotate(180)`}>
                    <g ref={noteRef} transform={getNoteTransform(width, height)}>
                        <Annot
                            align={hText ? "center left" : "bottom center"}
                            color={color} fontSize={`${fontSizePx}px`} {...annotProps} >
                            {children}
                        </Annot>
                    </g>
                    <path ref={accoladeRef} d={getAccoladeD(width, height)}
                        fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
                </g>
            </g>
        </g>
    );
};

export const TextAccolade = React.forwardRef(_TextAccolade);

