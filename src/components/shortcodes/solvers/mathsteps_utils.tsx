import _ from "lodash";
import CHANGE_DESCRIPTORS from "./changeDescriptors";
import mathsteps from "mathsteps";

type MathstepsStepType = {
    oldEquation: MathstepsEquationType,
    newEquation: MathstepsEquationType,
    oldNode: MathstepsNodeType,
    newNode: MathstepsNodeType
    changeType: string,
}

type MathstepsNodeType = {
    changeGroup: string,
    toTex: Function,
    value: string,
    args: MathstepsNodeType[],
}

type MathstepsEquationType = {
    leftNode: MathstepsNodeType,
    rightNode: MathstepsNodeType,
    comparator: string,
}

export type StepType = {
    before: string,
    after: string,
    description: string
}

function getStepFromMathstepsStep(msStep: MathstepsStepType): StepType {
    let oldStep = undefined;
    let newStep = undefined;
    if (_.has(msStep, "newEquation")) {
        oldStep = texSingleEqn(msStep.oldEquation);
        newStep = texSingleEqn(msStep.newEquation);
    } else if (_.has(msStep, "newNode")) {
        oldStep = texSingleNode(msStep.oldNode);
        newStep = texSingleNode(msStep.newNode);
    }
    return {
        before: oldStep,
        after: newStep,
        description: getChangeDescr(msStep)
    };
}

export function getSolveEquationSteps(eqn: string): StepType[] {
    return mathsteps.solveEquation(eqn).map(getStepFromMathstepsStep);
}


function customTex(node: MathstepsNodeType) {
    if (node.changeGroup) {
        return String.raw`\class{cgrp${node.changeGroup}}{${node.toTex()}}`;
    } else {
        return node.value;
    }
}

function getChangeGroup(node: MathstepsNodeType): MathstepsNodeType|null {
    if (node.changeGroup) {
        return node;
    } else if (node.args && node.args.length > 0) {
        for (let i = 0; i < node.args.length; i++) {
            let cgrpNode = getChangeGroup(node.args[i]);
            if (cgrpNode && cgrpNode.changeGroup) {
                return cgrpNode;
            }
        }
    }
    return null;
}

function compToTex(comp: string) {
    if (comp == ">=") {
        return "\\ge";
    } else if (comp == "<=") {
        return "\\le";
    } else {
        return comp;
    }
}

function texSingleNode(node: MathstepsNodeType) {
    return node.toTex({ handler: customTex });
}

function texSingleEqn(eqn: MathstepsEquationType) {
    let texEq = texSingleNode(eqn.leftNode);
    texEq += compToTex(eqn.comparator);
    texEq += texSingleNode(eqn.rightNode);
    return texEq;
}

function getChangeDescr(msStep: MathstepsStepType): string {
    let change = CHANGE_DESCRIPTORS[msStep.changeType];
    if (change instanceof Function) {
        let cgrpNode: MathstepsNodeType|null;
        if (_.has(msStep, "newEquation")) {
            cgrpNode = getChangeGroup(msStep.newEquation.leftNode);
            if (cgrpNode == null) {
                cgrpNode = getChangeGroup(msStep.newEquation.rightNode);
            }
        } else {
            if (!_.has(msStep, "newNode")) {
                throw "Step has no property newEquation or newNode";
            }
            cgrpNode = getChangeGroup(msStep.newNode);
        }
        if (cgrpNode === null) {
            throw "Expression contains no changeGroup, but step expects one";
        }
        change = change("$" + cgrpNode.toTex({ handler: customTex }) + "$");
        return change;
    } else {
        return change;
    }
}