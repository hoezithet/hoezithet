import React, { useRef } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getChildAtIndex } from "../../utils/children";
import { shuffle as shuffleArray } from '../../utils/array';
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type MultipleChoiceProps = {
    children: React.ReactNode,
    choices: React.ReactNode[],
    solution: number,
    shuffle?: boolean,
};


const _MultipleChoice = ({ children, choices, solution, shuffle=true}: MultipleChoiceProps) => {
    const solutionNode = choices[solution];
    const explanation = getChildAtIndex(children, 1) || null;
    const evaluateAnswerValue = (v: number|null) => v === solution;

    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solutionNode, explanation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswerValue(e.target ? Number(e.target.value) : null);
    };
    
    const choiceIdxs = [...Array(choices?.length || 0).keys()];
    const shuffledIdxsRef = useRef(shuffleArray(choiceIdxs));
    const idxs = shuffle ? shuffledIdxsRef.current : choiceIdxs;

    return (
        <RadioGroup value={answerValue} onChange={handleChange}>
            {
                idxs.map((index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={choices[index]} disabled={showingSolution} />
                ))
            }
        </RadioGroup>
    );
};

/**
 * An answer where the user needs to select one of multiple choices.
 *
 * The component can be used like so:
 * 
 * ```jsx
 * <Exercise>
 *   2 + 5 is equal to
 *   <MultipleChoice shuffle={false} solution={1}>
 *     <ul>
 *       <li>4</li>
 *       <li>7</li>
 *       <li>-5</li>
 *     </ul>
 *   </MultipleChoice>
 * </Exercise>
 * ```
 *
 * Since `shuffle` is set to `false`, for the above node, the choices will always be shown in the given order.
 *
 * For the sake of didactics, we can provide an explanation (using the `Explanation` component) on why the correct choice is correct:
 *
 * ```jsx
 * <Exercise>
 *   2 + 5 is equal to
 *   <MultipleChoice shuffle={false} solution={1}>
 *     <ul>
 *       <li>4</li>
 *       <li>7</li>
 *       <li>-5</li>
 *     </ul>
 *     <Explanation>
 *       If you'd be standing at number 2 on a number line and would take 5 steps to the right, you'll end up standing at number 7.
 *     </Explanation>
 *   </MultipleChoice>
 * </Exercise>
 * ```
 *
 * Note that with MDX, you can simply create the choices with markdown-syntax:
 *
 * ```jsx
 * <Exercise>
 *   2 + 5 is equal to
 *   <MultipleChoice shuffle={false} solution={1}>
 *
 *       - 4
 *       - 7
 *       - -5
 *
 *     <Explanation>
 *       If you'd be standing at number 2 on a number line and would take 5 steps to the right, you'll end up standing at number 7.
 *     </Explanation>
 *   </MultipleChoice>
 * </Exercise>
 * ``` 
 *
 * @prop {React.ReactNode} children The first child node should be a list-like component. The list items will be used as the choices. If present, the second child will be used as the explanation of the solution. All other children will be ignored.
 * @prop {number} solution The index of the correct choice item. When `solution` is a function, the solution will be calculated by calling the given function with the exercise variables (received from the `ExerciseContext`)
 *   as the argument. This latter functionality is provided by the HOC `withCallableSolution`.
 * @prop {boolean} [shuffle=true] If `true`, shuffle the choices so that the user sees the choices in a different order when starting over.
 */
export const MultipleChoice = withFeedback(_MultipleChoice);