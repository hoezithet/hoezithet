import React, {useCallback, useState} from 'react';
import mathsteps from 'mathsteps';
import math from 'mathjs';
import _ from 'lodash';
import changeDescr from './changeDescrs';
import { Markdown } from '../../../utils/md2react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ParentSize } from '@visx/responsive';
import colors from '../../../colors';


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

const useStyles = makeStyles(theme => ({
    connectorGrid: {
        display: 'flex',
        justifyContent: 'right',
    },
    explnGrid: {
        paddingLeft: theme.spacing(2)
    },
}));

const EqnStep = ({ step }) => {
    const classes = useStyles();
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

    const substeps = (step.substeps && step.substeps.length > 0 ?
        <EqnSteps steps={step.substeps} nextStep={0} />
        : null);

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

    return (
        <>
        <Grid container>
            <Grid item xs={6} className={classes.connectorGrid}>
                <svg width={svgWidth} height={explnHeight}>
                    <path d={`M ${svgWidth/2} ${strokeWidth/2} V ${explnHeight - strokeWidth/2}`} stroke={colors.LIGHT_GRAY} strokeWidth={strokeWidth} strokeLinecap="round" />
                </svg>
            </Grid>
            <Grid item xs={6} ref={explnRef} className={classes.explnGrid}>
                <Markdown mathProcessor='mathjax'>
                    { change }
                </Markdown>
            </Grid>
        </Grid>
        <div>
            <Markdown mathProcessor='mathjax'>
                { `$$\n${newStep}\n$$` }
            </Markdown>
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
                    onClick={nextStep === steps.length ? handleReset : handleNext}>
                    { nextStep === steps.length ? "Begin opnieuw" : "Volgende stap" }
                </Button>
            </Grid>
        </Grid>
        </>
    );
};
