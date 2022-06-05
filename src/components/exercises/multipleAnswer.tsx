import React, { useRef } from "react";
import uniqueId from "lodash/uniqueId";

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";
import { shuffle as shuffleArray } from '../../utils/array';


type MultipleAnswerProps = {
    children: React.ReactNode,
    choices: React.ReactNode[],
    solution: number[],
    shuffle?: boolean,
};

const _MultipleAnswer = ({ choices, children, solution, shuffle=true }: MultipleAnswerProps) => {
    const solutionNodes = solution.map(s => choices[s]);
    const explanation = getChildAtIndex(children, 0) || null;
    const evaluateAnswerValue = (v: number[]|null) => {
        if (v === null) { return false };
        if (v.length !== solution.length) { return false };
        return new Set([...v, ...solution]).size === v.length;
    };
    const [id] = React.useState(() => uniqueId());

    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solutionNodes, explanation);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (answerValue === null) {
            setAnswerValue([val]);
        } else if (e.target.checked) {
            setAnswerValue([...answerValue, val]);
        } else {
            const newAnsVal = [...answerValue.filter(ans => ans !== val)];
            if (newAnsVal.length !== 0) {
                setAnswerValue(newAnsVal);
            } else {
                setAnswerValue(null);
            }
        }
    }
    
    const choiceIdxs = [...Array(choices?.length || 0).keys()];
    const shuffledIdxsRef = useRef(shuffleArray(choiceIdxs));
    const idxs = shuffle ? shuffledIdxsRef.current : choiceIdxs;

    return (
        <form>
            {
                idxs.map(index => {
                    const inputId = `${id}_${index}`;
                    <>
                        <input type="checkbox" id={inputId} disabled={showingSolution} checked={answerValue !== null ? answerValue.includes(index) : false} onClick={handleChange}/>
                        <label for={inputId}>{choices[index]}</label>
                    </>
                 })
            }
        </form>
    );
};

/**
 * Same as `MultipleChoice`, but with multiple correct answers.
 */
export const MultipleAnswer = withFeedback(_MultipleAnswer);
