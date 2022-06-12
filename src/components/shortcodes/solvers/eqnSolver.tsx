import React, { useState, useContext, useCallback, useEffect, DOMElement, useRef, useLayoutEffect } from "react";
import Markdown from "../../markdown";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import colors from "../../../colors";
import { ExerciseContext } from "../exercise";
import { StepType, getSolveEquationSteps } from "./mathsteps_utils";
import useClientRect from "../../../hooks/useClientRect";
import { useGsapFrom, useGsapFromTo, useGsapTo } from "../../../hooks/useGsap";
import gsap from 'gsap';
import getOuterHeight from "../../../utils/outerHeight";


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

type MathJaxProps = {
    children: string
}

const MathJax = ({ children }: MathJaxProps) => {
    return <Markdown mathProcessor="mathjax">{`$$\n${children}\n$$`}</Markdown>;
}

type LightBulbProps = {
    size?: number,
    off?: boolean,
}

const LightBulb = ({ size = 100, off = false }: LightBulbProps) => {
    const scale = size / 100;
    return (
        <g transform={`scale(${scale})`}>
            <path
                d="m 41.632641,25.273112 c -0.389282,7.200323 -2.917049,14.007852 -7.392878,19.262155 -3.113612,3.697309 -4.86313,8.563861 -4.86313,13.428882 0,11.286915 9.143792,20.625153 20.625228,20.625153 0.778429,0 1.554907,-0.190244 2.333306,-0.190244 9.146224,-1.167996 16.739356,-8.370135 18.101574,-17.321883 0.97301,-5.837881 -0.582318,-11.484543 -4.279807,-16.154997 -4.670395,-6.032597 -7.396586,-12.643324 -7.785868,-19.648916 z"
                fill={off ? colors.LIGHT_GRAY : colors.GOLD} />
            <path d="m 72.768276,77.231617 c -0.389282,-0.390257 -0.973011,-0.583292 -1.362293,-0.583292 -0.583713,0 -0.97301,0.19443 -1.362142,0.583292 -0.778444,0.777739 -0.778444,1.946006 0,2.72445 l 7.394859,7.589455 c 0.77843,0.777739 1.945991,0.777739 2.72436,0 0.778429,-0.777739 0.778429,-1.946005 0,-2.724434 z m -53.125992,-47.482481 7.978647,7.978602 c 0.77843,0.777739 1.946021,0.777739 2.724405,0 0.778429,-0.777739 0.778429,-1.946155 0,-2.724434 l -7.978617,-7.978753 c -0.973011,-0.777724 -1.946021,-0.777724 -2.724435,0 -0.583713,0.583293 -0.583713,1.946156 0,2.724585 z m 50.012365,7.783886 c 0.778429,0.777739 1.94602,0.777739 2.72442,0 l 7.784006,-7.783886 c 0.778429,-0.777739 0.778429,-1.946156 0,-2.724585 -0.972995,-0.777724 -1.751394,-0.777724 -2.72436,0 l -7.784066,7.784036 c -0.778429,0.777724 -0.778429,1.946141 0,2.724435 z M 28.788523,76.453323 c -0.583713,0 -0.972996,0.194446 -1.362143,0.583308 l -7.58944,7.589605 c -0.778429,0.777724 -0.778429,1.945856 0,2.7243 0.778444,0.777723 1.946006,0.777723 2.724405,0 l 7.589425,-7.58932 c 0.778444,-0.777739 0.778444,-1.946156 0,-2.724585 -0.389282,-0.388862 -0.972995,-0.583308 -1.362142,-0.583308 z m 21.211462,9.146194 c -1.167576,0 -1.94599,0.777723 -1.94599,1.946005 v 10.508336 c 0,1.167996 0.778429,1.946137 1.94599,1.946137 1.167726,0 1.94602,-0.777721 1.94602,-1.946137 V 87.545522 c 0,-1.167996 -0.778429,-1.946005 -1.94602,-1.946005 z M 77.827877,57.187686 c 0,1.167996 0.77843,1.94614 1.946006,1.94614 h 11.092244 c 1.167576,0 1.946005,-0.777723 1.946005,-1.94614 0,-1.167996 -0.778429,-1.94587 -1.946005,-1.94587 H 79.773883 c -1.167576,0 -1.946006,0.973565 -1.946006,1.94587 z M 9.1338584,59.133826 H 20.226102 c 1.167726,0 1.946006,-0.777723 1.946006,-1.94614 0,-1.167996 -0.778445,-1.94587 -1.946006,-1.94587 H 9.1338584 c -1.1675762,0 -1.9459903,0.777724 -1.9459903,1.94587 0,1.167996 0.9729951,1.94614 1.9459903,1.94614 z"
                fill={colors.GOLD}
                fillOpacity={off ? 0 : 1}
                strokeWidth={1}
                stroke={colors.GOLD}
                strokeOpacity={off ? 0 : 1} />
            <rect width={20} height={30} x={40} y={0} rx={5} ry={5} fill={colors.BLACK} />
        </g>
    );
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
        top: 0,
        left: 0,
    },
}));

type EqnSolutionStepProps = {
    step: StepType,
    substeps?: StepType[],
    hideBefore?: boolean,  // If true, hide the old equation
    hideAfter?: boolean,  // If true, hide the new equation
    ignoreSubsteps?: boolean,
    key?: number,
    showBulb?: boolean,
    hide?: boolean,
}

const EqnSolutionStep = ({ step, substeps = [], hideBefore = false, hideAfter = false, ignoreSubsteps = false, showBulb = false, hide = false }: EqnSolutionStepProps) => {
    const [showingSubsteps, setShowSubsteps] = useState(false);
    const [bulbOn, setBulbOn] = useState(false);
    const tlRef = useRef(gsap.timeline({
        defaults: {
            ease: "power2.out",
            duration: 1.0,
        },
        paused: true,
    }));
    const tl = tlRef.current;

    const [descrTextRect, descrTextRef] = useClientRect();
    const [descrWrapperRect, descrWrapperRef] = useClientRect();
    const [afterEqnHeight, afterEqnWrapperRef] = useMjxOuterHeight();
    const [beforeEqnHeight, beforeEqnWrapperRef] = useMjxOuterHeight();

    const strokeWidth = 2;
    const bulbSize = 30;
    const [descrWidth, descrHeight] = [descrWrapperRect?.width || 0, (descrTextRect?.height || 0) + (descrTextRect !== null && showBulb ? bulbSize : 0)];
    const strokeLength = descrHeight - strokeWidth - (showBulb ? bulbSize : 0);
    const totalHeight = (beforeEqnHeight || 0) + descrHeight + (afterEqnHeight || 0);

    const classes = useStyles({
        showSubsteps: showingSubsteps,
        descrWidth: descrWidth,
        descrHeight: descrHeight,
    });

    const stepWrapperRef = useGsapFromTo<HTMLDivElement>(
        {
            height: 0,
        },
        {
            height: totalHeight,
        },
        anim => {
            if (totalHeight > 0) {
                tl.add(anim, 0).addLabel("stepWrapper");
            } else {
                anim.kill();
            }
        },
        [totalHeight]
    );

    const pathRef = useGsapFrom<SVGPathElement>(
        {
            drawSVG: "0",
            ease: "power2.inOut",
        },
        anim => {
            tl.add(anim, "stepWrapper+=0.5").addLabel("wire");
        }
    );

    const descrTextAnimRef = useGsapFrom<HTMLDivElement>(
        {
            opacity: 0,
            ease: "power2.inOut",
        },
        anim => {
            tl.add(anim, "wire");
        }
    );

    const bulbAnimRef = useGsapFrom<SVGGElement>(
        {
            opacity: 0,
        },
        anim => {
            tl.add(anim, "wire+=0.5");
        }
    );

    const afterEqnRef = useGsapFrom<HTMLDivElement>(
        {
            opacity: 0,
            onStart: () => {
                setBulbOn(true);
            },
        },
        anim => {
            tl.add(anim, "wire+=1.0")
        }
    );

    useEffect(() => {
        if (!hide) {
            tl.timeScale(1.0).play();
        } else {
            tl.timeScale(3.0).reverse();
        }
    }, [hide])

    return (
        <div ref={stepWrapperRef}>
            {!hideBefore ? (
                <div ref={beforeEqnWrapperRef}>
                    <MathJax>{step.before}</MathJax>
                </div>
            ) : null}
            <div className={classes.descrWrapper} ref={descrWrapperRef}>
                <svg width={descrWidth} height={descrHeight} className={classes.descrSvg}>
                    <path
                        d={`M ${descrWidth / 2} ${strokeWidth / 2} v ${strokeLength}`}
                        stroke={colors.BLACK}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={
                            substeps && !showingSubsteps && !ignoreSubsteps
                                ? getSubstepDashArray(substeps.length, strokeLength)
                                : strokeLength
                        }
                        ref={pathRef}
                    />
                    {showBulb ? (
                        <g ref={bulbAnimRef} transform={`translate(${descrWidth / 2 - bulbSize / 2} ${strokeLength})`}>
                            <LightBulb size={bulbSize} off={!bulbOn} />
                        </g>
                    ) : null}
                </svg>
                <div className={classes.descrTextAnim} ref={descrTextAnimRef}>
                    <div className={classes.descrText} ref={descrTextRef}>
                        <Markdown mathProcessor="mathjax">{step.description}</Markdown>
                    </div>
                </div>
            </div>
            {!hideAfter ? (
                <div ref={afterEqnWrapperRef}>
                    <div ref={afterEqnRef} className={classes.afterEqn}>
                        <MathJax>{step.after}</MathJax>
                    </div>
                </div>
            ) : null}
        </div>
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
            {steps.map((step: StepType, idx: number) => (
                <EqnSolutionStep step={step} key={idx} hideBefore showBulb={idx === steps.length - 1} hide={idx >= nextStepIdx}/>
            ))}
        </div>
    );
};

type EqnSolverProps = {
    eqn: string
};

export const EqnSolver = ({ eqn }: EqnSolverProps) => {
    const exCtx = useContext(ExerciseContext);
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
                    <Button variant="contained" color="primary" onClick={handleNext} disabled={nextStepIdx === steps.length}>
                        Volgende stap
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};


function useMjxOuterHeight(): [number|null, (node: any) => void] {
    const [outerHeight, setOuterHeight] = useState<number|null>(null);
    const wrapperRef = useCallback((node: HTMLElement) => {
        const mjxContainer = node?.querySelector("mjx-container") as HTMLElement;
        if (mjxContainer !== null) {
            setOuterHeight(getOuterHeight(mjxContainer));
        }
    }, []);
    return [outerHeight, wrapperRef];
}
