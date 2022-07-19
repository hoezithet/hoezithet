import React from 'react';
import TextField from '@mui/material/TextField';

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type FillStringProps = {
    children: React.ReactNode,
    solution: string,
};

const _FillString = ({ children, solution }: FillStringAnswerProps) => {
    const explanation = getChildAtIndex(children, 0) || null;
    const evaluateAnswerValue = (v: string|null) => v === String(solution);
    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solution, explanation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setAnswerValue(null);
        } else {
            setAnswerValue(String(e.target.value));
        }
    }

    return (
        <TextField disabled={showingSolution} variant="filled" onChange={handleChange}
            placeholder={showingSolution && answerValue !== null ? answerValue : "Vul in"} value={answerValue !== null ? answerValue : "" } />
    );
};

/**
 * An answer where the user needs to respond in a text field and the evaluation can be done with strict string comparison.
 *
 * @prop {React.ReactNode} children If present, the first child node will be used as the explanation of the solution. All other children will be ignored.
 * @prop {string} solution The solution. Only when a given answer is equal to the solution by string equality, the answer will be evaluated as "correct".
 */
export const FillString = withFeedback(_FillString);