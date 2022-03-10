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
    const explanation = getChildAtIndex(children, 0) || null;
    const evaluateAnswerValue = React.useCallback((v: number|null) => v === solution, [solution]);

    const {answerValue, setAnswerValue, showingSolution, trial, id} = useAnswerValue(evaluateAnswerValue, solutionNode, explanation);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswerValue(e.target ? Number(e.target.value) : null);
    }, [setAnswerValue]);
    
    const [choiceIdxs, setChoiceIdxs] = React.useState([...Array(choices?.length || 0).keys()]);

    React.useEffect(() => {
        if (shuffle) {
            setChoiceIdxs(prevIdxs => [...shuffleArray(prevIdxs)]);
        }
    }, [trial]);

    console.log(`render _MultipleChoice ${id} (trial ${trial})`);

    return (
        <RadioGroup value={answerValue} onChange={handleChange}>
            {
                choiceIdxs.map((index) => (
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
 *   <MultipleChoice choices={["4", "7", "-5"]} shuffle={false} solution={1}/>
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
 *   <MultipleChoice choices={["4", "7", "-5"]}  shuffle={false} solution={1}>
 *     <Explanation>
 *       If you'd be standing at number 2 on a number line and would take 5 steps to the right, you'll end up standing at number 7.
 *     </Explanation>
 *   </MultipleChoice>
 * </Exercise>
 * ```
 *
 * @prop {React.ReactNode} children If present, the first child will be used as the explanation of the solution. All other children will be ignored.
 * @prop {array} choices The choices to pick from.
 * @prop {number} solution The index of the correct choice item.
 * @prop {boolean} [shuffle=true] If `true`, shuffle the choices so that the user sees the choices in a different order when starting over.
 */
export const MultipleChoice = withFeedback(_MultipleChoice);