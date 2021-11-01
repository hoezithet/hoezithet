import React, { createContext, useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { useStoredElement, Store, GetNextElementsType } from '../store';
import { AnswerType, useAnswers } from "./answer";
import { ExerciseStepperContext, useExerciseStepperExercises } from './exerciseStepper';
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';

import { RootState } from '../../state/store'
import { exerciseAdded, exerciseAnswerAdded, removeExercise } from '../../state/exercisesSlice';
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice';


export type ExerciseType = {
    id: string,
    answerIds: string[],
    showingSolution: boolean,
    rank: number
}

type ExerciseProps = {
	children: React.ReactNode,
	showTitle: boolean,
}

export type ExerciseContextValueType = {
    addAnswer: ((answerId: string) => void),
}

export const ExerciseContext = createContext<ExerciseContextValueType>({
    addAnswer: () => {},
    vars: {},
});

export const useExercises = () => {
    return useSelector(
        (state: RootState) => {
            return state.exercises;
        }
    )
};

export const useExercise = (id: string) => {
    return useExercises()?.find(ex => ex.id === id);
};

export const useExerciseAnswers = (exerciseId: string) => {
    const exercise = useExercise(exerciseId);
    const answers = useAnswers();
    return exercise?.answerIds.map(ansId =>
        answers?.find(ans => ans.id === ansId)
    );
};

export const useExerciseRankInStepper = (exerciseId: string, stepperId: string) => {
    return useExerciseStepperExercises(stepperId).map(ex => ex.id).indexOf(exerciseId);
};

/**
 * An exercise, consisting of one or more questions with answering modalities.
 *
 * The interactive parts of an exercise are provided by answering components like `MultipleChoice`,
 * `MultipleAnswer` and `FillString`. The user enters their response via the answering component and
 * can get feedback on their given answers. A simple exercise might look like this:
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
 * @prop {React.ReactNode} children The children of the exercise. Should contain some question text and one or more answer components.
 * @prop {boolean} showTitle If `true`, show a title above the exercise displaying the rank number of the exercise inside the current lesson.
 * ```
 */
export const Exercise = ({ children, showTitle=true}: ExerciseProps) => {
    const id = useRef(nanoid());

    const exercise = useExercise(id.current);
    const answers = useExerciseAnswers(id.current);
    const nodeRef = useRef<HTMLDivElement>(null);

    const stepperContext = useContext(ExerciseStepperContext);
    const addExerciseIdToStepper = stepperContext?.addExercise;
    const stepperRank = stepperContext?.rank;
    const stepperId = stepperContext?.id;
    const dispatch = useDispatch();
    
    let rank = useExerciseRankInStepper(id.current, stepperId);
    rank = rank !== -1 ? rank : exercise?.rank;

    useEffect(() => {
        dispatch(
            exerciseAdded({
                id: id.current,
            })
        )
        if (addExerciseIdToStepper !== null) {
            addExerciseIdToStepper(id.current)
        }
        return () =>  { removeExercise({ id: id.current }) };
    }, []);

    const addAnswerId = (answerId: string) => {
        dispatch(
            exerciseAnswerAdded({
                exerciseId: id.current,
                answerId: answerId,
            })
        )
    }

    const allAnswered = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.answered)
    );

    const allShowingSolutions = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.showingSolution)
    );

    const showSolutions = () => {
        answers?.forEach(ans => {
            dispatch(
                showAnswerSolution({
                    id: ans?.id
                })
            )
        });
    };

    const handleReset = () => {
        answers?.forEach(ans => {
            dispatch(
                resetAnswer({
                    id: ans?.id
                })
            )
        });
    };

    const insideStepper = addExerciseIdToStepper !== null;
	const title = showTitle && rank !== undefined ? <ExerciseTitle rank={rank} stepperRank={stepperRank} /> : null;

    const ctxValRef = useRef<ExerciseContextValueType>({
        addAnswer: addAnswerId,
    });
    return (
        <ExerciseContext.Provider value={ctxValRef.current}>
            <div ref={nodeRef}>
                {
                insideStepper ?
                <>
                { title }
                { children }
                </>
                :
                <Paper>
                    { title }
                    { children }
                    {
                    allShowingSolutions ?
                    <Button onClick={handleReset}>
                        { "Begin opnieuw" }
                    </Button>
                    : null
                    }
                    {
                    !allShowingSolutions ?
                    <Button variant="contained"
                        color="primary"
                        disabled={!allAnswered}
                        onClick={showSolutions} >
                        {"Toon feedback"}
                    </Button>
                    : null
                    }
                </Paper>
                }
            </div>
        </ExerciseContext.Provider>
    );
};

type ExerciseTitleProps = {
    rank: number,
    stepperRank: number|null,
}

const ExerciseTitle = ({ rank, stepperRank }: ExerciseTitleProps) => {
    rank = rank || 0;
    let name = '';
    if (stepperRank === null) {
        name += (rank + 1);
    } else {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        name += (stepperRank + 1) + alphabet.charAt(rank % 26);
    }
    return <h3>{ `Oefening ${name}` }</h3>;
};

export const TitledExercise = (props: ExerciseProps) => {
	return <Exercise {...props} showTitle={ true } />;
};
