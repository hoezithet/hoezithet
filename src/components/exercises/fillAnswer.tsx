import React from 'react';
import TextField from '@mui/material/TextField';

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


const _FillString = ({ solution, ...props }) => {
    const evaluateAnswerValue = (v: string|null) => v !== null && String(v) === String(solution);
    return <_FillAny evaluate={evaluateAnswerValue} solution={solution} {...props} />
};


type FillAnyProps = {
    children: React.ReactNode,
    evaluate: (answerValue: any) => boolean,
    solution: string,
    placeholder?: string,
    variant?: string,
};

const _FillAny = ({ children, evaluate, solution, placeholder="Vul in", variant="filled" }: FillAnyProps) => {
    const explanation = getChildAtIndex(children, 0) || null;
    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluate, solution, explanation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setAnswerValue(null);
        } else {
            setAnswerValue(e.target.value);
        }
    }

    return (
        <TextField disabled={showingSolution} variant={variant} onChange={handleChange}
            placeholder={showingSolution ? answerValue : placeholder} value={answerValue} />
    );
};

/**
 * An answer where the user needs to respond in a text field and the evaluation can be done with strict string comparison.
 *
 * @prop {React.ReactNode} children If present, the first child node will be used as the explanation of the solution. All other children will be ignored.
 * @prop {string} solution The solution. Only when a given answer is equal to the solution by string equality, the answer will be evaluated as "correct".
 */
export const FillString = withFeedback(_FillString);


/**
 * An answer where the user needs to respond in a text field and the evaluation can be done with strict string comparison.
 *
 * @prop {React.ReactNode} children If present, the first child node will be used as the explanation of the solution. All other children will be ignored.
 * @prop {string} solution The solution. Only when a given answer is equal to the solution by string equality, the answer will be evaluated as "correct".
 */
 export const FillAny = withFeedback(_FillAny);
