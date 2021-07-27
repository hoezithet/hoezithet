import React, {useCallback, useState, useContext} from 'react';
import mathsteps from 'mathsteps';
import math from 'mathjs';
import _ from 'lodash';
import changeDescr from './changeDescrs';
import { Markdown } from '../../../utils/md2react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import UnfoldMoreRoundedIcon from '@material-ui/icons/UnfoldMoreRounded';
import UnfoldLessRoundedIcon from '@material-ui/icons/UnfoldLessRounded';
import colors from '../../../colors';
import { ExerciseContext } from '../exercise'


function customTex(node, options) {
	if (node.changeGroup) {
		return String.raw`\class{cgrp${node.changeGroup}}{${node.toTex()}}`;
	} else {
		return node.value;
	}
}

function getChangeGroup(node) {
	if (node.changeGroup) {
		return node;
	} else if (node.args && node.args.length > 0) {
		for (let i=0; i < node.args.length; i++) {
			let cgrpNode = getChangeGroup(node.args[i]);
			if (cgrpNode && cgrpNode.changeGroup) {
				return cgrpNode;
			}
		}
	}
	return;
}

function compToTex(comp) {
	if (comp == ">=") {
		return "\\ge";
	} else if (comp == "<=") {
		return "\\le";
	} else {
		return comp;
	}
}

function texSingleNode(node) {
	let rgx = /([ ~]*?)\+[ ~]*?((\\[^{]*{)?[ ~]*?\-[ ~]*?)/gm;
	let rgxMinBrack = /([ ~]*?\\cdot[ ~]*?)((\\[^{]*{)?[ ~]*?)(\-[ ~]*?\d+)/gm;
	return node.toTex({handler: customTex});//.replace(rgx, '$1$2').replace(rgxMinBrack, '$1$2$4');
}

function texSingleEqn(eqn) {
	let texEq = texSingleNode(eqn.leftNode);
	texEq += compToTex(eqn.comparator);
	texEq += texSingleNode(eqn.rightNode);
	return texEq
}

function getChangeDescr(step) {
	let change = changeDescr[step.changeType];
	if (typeof change === "function") {
		let cgrpNode = undefined;
		if (_.has(step, 'newEquation')) {
			cgrpNode = getChangeGroup(step.newEquation.leftNode);
			if (cgrpNode == null) {
				cgrpNode = getChangeGroup(step.newEquation.rightNode);
			}
		} else if(_.has(step, 'newNode')) {
			cgrpNode = getChangeGroup(step.newNode);
		} else {
			console.log('' + step + ' has no property newEquation or newNode');
		}
		if (cgrpNode) {
			change = change('$' + cgrpNode.toTex({handler: customTex}) + '$');
		} 
	}
	return change;
}

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

const useStyles = makeStyles(theme => ({
    connectorGrid: {
        display: 'flex',
        justifyContent: 'end',
    },
    explnGrid: {
        textAlign: 'start',
        paddingLeft: props => props.showSubsteps ? 0 : theme.spacing(2)
    },
    substepsDiv: {
        textAlign: 'center',
        border: `3px dotted ${colors.LIGHT_GRAY}`,
        borderRadius: theme.spacing(1),
        margin: theme.spacing(0, 1),
    },
    substepsBtn: {
        alignSelf: 'center',
        paddingRight: theme.spacing(2),
        color: colors.LIGHT_GRAY,
    },
    explnTextDiv: {
        textAlign: props => props.showSubsteps ? 'center' : 'left',
    }
}));

const EqnStep = ({ step, showResult=true, ignoreSubsteps=false }) => {
    const [showSubsteps, setShowSubsteps] = useState(false);
    const classes = useStyles({ showSubsteps: showSubsteps });
	let change = getChangeDescr(step);

	let oldStep = undefined;
	let newStep = undefined;
	if (_.has(step, 'newEquation')) {
		oldStep = texSingleEqn(step.oldEquation);
		newStep = texSingleEqn(step.newEquation);
	} else if (_.has(step, 'newNode')) {
		oldStep = texSingleNode(step.oldNode);
		newStep = texSingleNode(step.newNode);
	}

    const substeps = !ignoreSubsteps && step.substeps && step.substeps.length > 0 ?  step.substeps : null;

    const [explnHeight, setExplnHeight] = useState(0);
    const explnRef = useCallback(node => {
        if (node !== null) {
            setExplnHeight(prevHeight => {
                if (prevHeight === 0) {
                    return node.getBoundingClientRect().height;
                } else {
                    return prevHeight;
                }
            });
        }
    }, []);

    const svgWidth = 10;
    const strokeWidth = 3;
    const strokeLength = explnHeight - strokeWidth;
    
    const connector = (
        <svg width={svgWidth} height={explnHeight}>
            <path d={`M ${svgWidth/2} ${strokeWidth/2} v ${strokeLength}`}
              stroke={colors.LIGHT_GRAY} strokeWidth={strokeWidth} strokeLinecap="round"
              strokeDasharray={ substeps && !showSubsteps ? `${0.3 * strokeLength} ${0.1 * strokeLength} 0 ${0.1 * strokeLength} 0 ${0.1 * strokeLength} ${0.3 * strokeLength}` : strokeLength }/>
        </svg>
    );

    return (
        <>
        <Grid container>
            <Grid item xs={6} className={classes.connectorGrid}>
                { substeps ? (
                      <Button size="small" className={classes.substepsBtn} onClick={() => setShowSubsteps(prev => !prev)} endIcon={ showSubsteps ? <UnfoldLessRoundedIcon/>: <UnfoldMoreRoundedIcon/> }>Tussenstappen</Button>
                  )
                  : null }
                { connector }
            </Grid>
            <Grid item xs={substeps && showSubsteps ? 12 : 6} ref={explnRef} className={classes.explnGrid}>
                <div className={classes.explnTextDiv}>
                    <Markdown mathProcessor='mathjax'>
                        { change }
                    </Markdown>
                </div>
                <div>
                    { substeps && showSubsteps ?
                      <div className={classes.substepsDiv}>
                          { substeps.map((step, idx) => <EqnStep step={step} key={idx} showResult={idx !== substeps.length - 1} ignoreSubsteps />) }
                      </div>
                      : null
                    }
                </div>
            </Grid>
            { substeps && showSubsteps ?
              <Grid item xs={6} className={classes.connectorGrid}>
                  { connector }
              </Grid>
              : null }
        </Grid>
        <div>
            { showResult ?
              <Markdown mathProcessor='mathjax'>
                  { `$$\n${newStep}\n$$` }
              </Markdown>
              : null }
        </div>
        </>
    );
};

const EqnSteps = ({ steps, nextStep }) => {
    if (steps.length === 0) { return null; }

    const firstStep = steps[0];
    let firstEqTex;
	if (_.has(firstStep, 'newEquation')) {
		firstEqTex = texSingleEqn(firstStep.oldEquation);
	} else if (_.has(firstStep, 'newNode')) {
		firstEqTex = texSingleNode(firstStep.oldNode);
	}
    return (
        <div>
            <Markdown mathProcessor='mathjax'>
                { `$$\n${firstEqTex}\n$$`}
            </Markdown>
            {
              steps.slice(0, nextStep)
              .map((step, idx) => <EqnStep step={step} key={idx}/>)
            }
        </div>
    );
};

export const EqnSolver = ({ eqn }) => {
    const exCtx = useContext(ExerciseContext);
    eqn = typeof eqn === "function" ? eqn(exCtx.vars) : eqn;
    const [nextStep, setNextStep] = useState(0);
    const steps = mathsteps.solveEquation(eqn);

    const handleNext = () => {
        setNextStep((prevStep) => {
            if (prevStep === steps.length) {
                return prevStep;
            } else {
                return prevStep + 1;
            }
        });
    }

    const handlePrev = () => {
        setNextStep((prevStep) => {
            if (prevStep === 0) {
                return prevStep;
            } else {
                return prevStep - 1;
            }
        });
    }

    const handleReset = () => {
        setNextStep(0);
    }

    return (
        <>
        <EqnSteps steps={steps} nextStep={nextStep} />
        <Grid container spacing={2} >
            <Grid item >
                <Button onClick={handlePrev} disabled={nextStep === 0}>
                    Vorige stap
                </Button>
            </Grid>
            <Grid item >
                <Button color="primary" variant="contained"
                    disabled={nextStep === steps.length}
                    onClick={handleNext}>
                    Volgende stap
                </Button>
            </Grid>
        </Grid>
        </>
    );
};
