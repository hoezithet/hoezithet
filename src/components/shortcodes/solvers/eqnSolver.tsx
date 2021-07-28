import React, { useState, useContext, useCallback, useEffect, DOMElement } from "react";
import { Markdown } from "../../../utils/md2react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import colors from "../../../colors";
import { ExerciseContext } from "../exercise";
import { StepType, getSolveEquationSteps } from "./mathsteps_utils";
import { ExVarsType } from "../exerciseVar";
import useClientRect from "../../../hooks/useClientRect";
import { useGsapFrom, useGsapTo } from "../../../hooks/useGsap";
import gsap from 'gsap';
import { RoughEase } from "gsap/EasePack";

gsap.registerPlugin(RoughEase);

const getSubstepDashArray = (nSubsteps: number, strokeLength: number, spacing: number = 5) => {
    if (nSubsteps === 0) {
        return strokeLength;
    }
    const nSpaces = nSubsteps + 1;
    const startStroke = (strokeLength - nSpaces*spacing) / 2;
    const endStroke = startStroke;
    const stroke = [
        startStroke,
        ...Array(nSubsteps).fill(null).reduce((r) => r.concat(0, spacing), [spacing]),
        endStroke
    ].join(' ');

    return stroke;
};

type UseStylesProps = {
    showSubsteps: boolean,
    descrWidth: number,
    descrHeight: number,
};

const useStyles = makeStyles<Theme, UseStylesProps>(theme => ({
    substepsDiv: {
        textAlign: "center",
        border: `3px dotted ${colors.LIGHT_GRAY}`,
        borderRadius: theme.spacing(1),
        margin: theme.spacing(0, 1),
    },
    substepsBtn: {
        alignSelf: "center",
        paddingRight: theme.spacing(2),
        color: colors.LIGHT_GRAY,
    },
    descrText: {
        textAlign: ({ showSubsteps }) => (showSubsteps ? "center" : "left"),
        position: "absolute",
        left: ({ descrWidth }) => `${descrWidth / 2 + theme.spacing(2)}px`,
    },
    descrWrapper: {
        position: "relative",
        height: ({ descrHeight }) => `${descrHeight}px`,
        width: "100%",
    },
    descrSvg: {
        position: "absolute",
        opacity: 0,
        top: 0,
        left: 0,
    },
    afterEqn: {
        opacity: 0,
    },
    descrTextAnim: {
        opacity: 0,
    }
}));

type MathJaxProps = {
    children: string
}

const MathJax = ({ children }: MathJaxProps) => {
    return <Markdown mathProcessor="mathjax">{`$$\n${children}\n$$`}</Markdown>;
}

type LightBulbProps = {
    size?: number,
    flicker?: boolean,
    on?: boolean,
}

const LightBulb = ({ size = 100, flicker = false, on = true }: LightBulbProps) => {
    const tl = gsap.timeline({
        paused: true,
        yoyo: true,
        repeat: -1,
        defaults: { ease: "rough({strength: 3, points: 50})", duration: 5},
    });
    
    const bulbRef = useGsapTo<SVGPathElement>({
        fill: on ? colors.LIGHT_GRAY : colors.GOLD,
    }, tl, "0");
    const raysRef = useGsapTo<SVGPathElement>({
        opacity: on ? 0 : 1,
    }, tl, "0");

    if (flicker) {
        tl.play();
    }
    
    return (
        <svg width={size} height={size}>
            <g transform={`scale(${size / 100})`}>
                <path
                    d="m 44.42523,50.21306 c -0.25936,4.79723 -1.94349,9.33276 -4.92552,12.83345 -2.07445,2.46334 -3.24007,5.70569 -3.24007,8.94702 0,7.51993 6.09207,13.74155 13.7416,13.74155 0.51863,0 1.03596,-0.12675 1.55457,-0.12675 6.09369,-0.77818 11.15263,-5.57662 12.06021,-11.54074 0.64827,-3.8895 -0.38797,-7.6516 -2.85143,-10.7633 -3.11166,-4.01923 -4.92799,-8.42364 -5.18735,-13.09113 z"
                    fill={on ? colors.GOLD : colors.LIGHT_GRAY}
                    ref={bulbRef}
                />
                <path
                    d="m 65.16941,84.83052 c -0.25936,-0.26001 -0.64827,-0.38862 -0.90763,-0.38862 -0.3889,0 -0.64827,0.12954 -0.90753,0.38862 -0.51864,0.51817 -0.51864,1.29653 0,1.81517 l 4.92684,5.05649 c 0.51863,0.51817 1.29652,0.51817 1.81511,0 0.51863,-0.51817 0.51863,-1.29653 0,-1.81516 z m -35.3953,-31.6353 5.31579,5.31576 c 0.51863,0.51817 1.29654,0.51817 1.81514,0 0.51863,-0.51817 0.51863,-1.29663 0,-1.81516 l -5.31577,-5.31586 c -0.64827,-0.51816 -1.29654,-0.51816 -1.81516,0 -0.3889,0.38862 -0.3889,1.29663 0,1.81526 z m 33.32084,5.18603 c 0.51863,0.51817 1.29654,0.51817 1.81515,0 l 5.18611,-5.18603 c 0.51863,-0.51817 0.51863,-1.29663 0,-1.81526 -0.64826,-0.51816 -1.16687,-0.51816 -1.81511,0 l -5.18615,5.18613 c -0.51863,0.51816 -0.51863,1.29662 0,1.81516 z M 35.86781,84.31198 c -0.3889,0 -0.64826,0.12955 -0.90753,0.38863 L 29.9038,89.7572 c -0.51863,0.51816 -0.51863,1.29643 0,1.81507 0.51864,0.51816 1.29653,0.51816 1.81514,0 l 5.05647,-5.0564 c 0.51864,-0.51817 0.51864,-1.29663 0,-1.81526 -0.25936,-0.25908 -0.64826,-0.38863 -0.90753,-0.38863 z m 14.13218,6.09367 c -0.7779,0 -1.29652,0.51816 -1.29652,1.29653 v 7.0012 c 0,0.77818 0.51863,1.29662 1.29652,1.29662 0.778,0 1.29654,-0.51816 1.29654,-1.29662 v -7.0012 c 0,-0.77818 -0.51863,-1.29653 -1.29654,-1.29653 z M 68.54038,71.47621 c 0,0.77818 0.51863,1.29662 1.29653,1.29662 h 7.39023 c 0.7779,0 1.29653,-0.51816 1.29653,-1.29662 0,-0.77818 -0.51863,-1.29644 -1.29653,-1.29644 h -7.39023 c -0.7779,0 -1.29653,0.64864 -1.29653,1.29644 z m -45.76753,1.29662 h 7.39023 c 0.778,0 1.29653,-0.51816 1.29653,-1.29662 0,-0.77818 -0.51864,-1.29644 -1.29653,-1.29644 h -7.39023 c -0.7779,0 -1.29652,0.51816 -1.29652,1.29644 0,0.77818 0.64826,1.29662 1.29652,1.29662 z"
                    fill={colors.GOLD}
                    fillOpacity={on ? 1 : 0}
                    strokeWidth={1}
                    stroke={colors.GOLD}
                    strokeOpacity={on ? 1 : 0}
                    ref={raysRef}
                />
                <rect width={14} height={20} x={43} y={34} rx={4} ry={4} fill={colors.BLACK} />
            </g>
        </svg>
    );
};

type EqnSolutionStepProps = {
    step: StepType,
    substeps?: StepType[],
    hideBefore?: boolean,  // If true, hide the old equation
    hideAfter?: boolean,  // If true, hide the new equation
    ignoreSubsteps?: boolean,
    key?: number,
}

const EqnSolutionStep = ({ step, substeps = [], hideBefore = false, hideAfter = false, ignoreSubsteps = false }: EqnSolutionStepProps) => {
    const [showingSubsteps, setShowSubsteps] = useState(false);

    const [descrTextRect, descrTextRef] = useClientRect();
    const [descrWrapperRect, descrWrapperRef] = useClientRect();

    const [descrWidth, descrHeight] = [descrWrapperRect?.width || 0, descrTextRect?.height || 0];
    const classes = useStyles({
        showSubsteps: showingSubsteps,
        descrWidth: descrWidth,
        descrHeight: descrHeight,
    });

    const strokeWidth = 3;
    const strokeLength = descrHeight - strokeWidth;

    const tl = gsap.timeline();
    const pathRef = useGsapFrom<SVGPathElement>({
        drawSVG: '0',
        duration: 1.0,
        ease: "power2.out"
    }, tl, 0);

    const descrSvgAnimRef = useGsapTo<SVGElement>({
        opacity: 1.0,
        duration: 1.0,
        ease: "power2.out"
    }, tl, 0);

    const descrTextAnimRef = useGsapTo<HTMLDivElement>({
        opacity: 1.0,
        duration: 0.5,
        ease: "power2.out"
    }, tl, 0.5);

    const afterEqnRef = useGsapTo<HTMLDivElement>({
        opacity: 1.0,
        duration: 0.5,
        ease: "power2.out"
    }, tl, 1.0);

    return (
        <>
            {!hideBefore ? <MathJax>{step.before}</MathJax> : null}
            <div className={classes.descrWrapper} ref={descrWrapperRef}>
                <svg width={descrWidth} height={descrHeight} className={classes.descrSvg} ref={descrSvgAnimRef}>
                    <path
                        d={`M ${descrWidth / 2} ${strokeWidth / 2} v ${strokeLength}`}
                        stroke={colors.LIGHT_GRAY}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={
                            substeps && !showingSubsteps && !ignoreSubsteps
                                ? getSubstepDashArray(substeps.length, strokeLength)
                                : strokeLength
                        }
                        ref={pathRef}
                    />
                </svg>
                <div className={classes.descrTextAnim} ref={descrTextAnimRef}>
                    <div className={classes.descrText} ref={descrTextRef}>
                        <Markdown mathProcessor="mathjax">{step.description}</Markdown>
                    </div>
                </div>
            </div>
            {!hideAfter ? (
                <div ref={afterEqnRef} className={classes.afterEqn}>
                    <MathJax>{step.after}</MathJax>
                </div>
            ) : null}
            <LightBulb size={50} flicker />
        </>
    );
};

type EqnSolutionStepsProps = {
    steps: StepType[],
    nextStepIdx: number,
};

const EqnSolutionSteps = ({ steps, nextStepIdx }: EqnSolutionStepsProps) => {
    if (steps.length === 0) {
        return null;
    }

    return (
        <div>
            <MathJax>{ steps[0].before }</MathJax>
            {steps.slice(0, nextStepIdx).map((step: StepType, idx: number) => (
                <EqnSolutionStep step={step} key={idx} hideBefore/>
            ))}
        </div>
    );
};

type EqnSolverProps = {
    eqn: string|((exVars: ExVarsType) => string)
};

export const EqnSolver = ({ eqn }: EqnSolverProps) => {
    const exCtx = useContext(ExerciseContext);
    eqn = eqn instanceof Function ? eqn(exCtx.vars) : eqn;
    const [nextStepIdx, setNextStepIdx] = useState(0);
    const steps = getSolveEquationSteps(eqn);

    const handleNext = () => {
        setNextStepIdx(prevStepIdx => {
            if (prevStepIdx === steps.length) {
                return prevStepIdx;
            } else {
                return prevStepIdx + 1;
            }
        });
    };

    const handlePrev = () => {
        setNextStepIdx(prevStep => {
            if (prevStep === 0) {
                return prevStep;
            } else {
                return prevStep - 1;
            }
        });
    };

    return (
        <>
            <EqnSolutionSteps steps={steps} nextStepIdx={nextStepIdx} />
            <Grid container spacing={2}>
                <Grid item>
                    <Button onClick={handlePrev} disabled={nextStepIdx === 0}>
                        Vorige stap
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={nextStepIdx === steps.length}
                        onClick={handleNext}
                    >
                        Volgende stap
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
