import React, { useState, useContext } from "react";
import { Markdown } from "../../../utils/md2react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import colors from "../../../colors";
import { ExerciseContext } from "../exercise";
import { StepType, getSolveEquationSteps } from "./mathsteps_utils";
import { ExVarsType } from "../exerciseVar";
import useClientRect from "../../../hooks/useClientRect";

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
    descrTextDiv: {
        textAlign: ({showSubsteps}) => (showSubsteps ? "center" : "left"),
        position: "absolute",
        left: ({descrWidth}) => `${descrWidth / 2 + theme.spacing(2)}px`,
    },
    descrWrapperDiv: {
        position: "relative",
        height: ({descrHeight}) => `${descrHeight}px`,
        width: "100%",
    },
    descrSvg: {
        position: "absolute",
        top: 0,
        left: 0
    }
}));

type MathJaxProps = {
    children: string
}

const MathJax = ({ children }: MathJaxProps) => {
    return <Markdown mathProcessor="mathjax">{`$$\n${children}\n$$`}</Markdown>;
}

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

    return (
        <>
            {!hideBefore ? <MathJax>{ step.before }</MathJax> : null}
            <div className={classes.descrWrapperDiv} ref={descrWrapperRef}>
                <svg width={descrWidth} height={descrHeight} className={classes.descrSvg}>
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
                    />
                </svg>
                <div className={classes.descrTextDiv} ref={descrTextRef}>
                    <Markdown mathProcessor="mathjax">{step.description}</Markdown>
                </div>
            </div>
            {!hideAfter ? <MathJax>{ step.after }</MathJax> : null}
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
