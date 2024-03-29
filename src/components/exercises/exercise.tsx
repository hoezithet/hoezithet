import React, { createContext, useContext, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'

import { AnswerType, selectAnswers, compareAnswers } from "./answer";
import { ExerciseStepperContext, makeSelectExerciseStepperExercises, makeSelectExerciseStepperFromId } from './exerciseStepper';
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';

import { RootState } from '../../state/store'
import { exerciseAdded, exerciseAnswerAdded, removeExercise, exerciseNameChanged } from '../../state/exercisesSlice';
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice';
import { exerciseStepperAdded, exerciseStepAdded, removeExerciseStepper } from '../../state/exerciseSteppersSlice';
import BareLessonContext from "contexts/bareLessonContext";

import useId from 'hooks/useId';


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

export const selectExercises = (state: RootState) => state.exercises;
const selectExerciseId = (state: RootState, exId: string) => exId;

export const makeSelectExerciseById = () => {
    const selectExerciseById = createSelector(
        [
          (state: RootState) => selectExercises(state),
          (state: RootState, exId: string) => selectExerciseId(state, exId)
        ],
        (exercises: ExerciseType[], id: string) => {
            return exercises?.find(ex => ex.id === id);
        }
    );
    return selectExerciseById;
};

export const makeSelectExerciseAnswers = () => {
    const selectExerciseById = makeSelectExerciseById();
    const selectExerciseAnswers = createSelector(
        [
          (state: RootState, exId: string) => selectExerciseById(state, exId),
          (state: RootState) => selectAnswers(state),
        ],
        (exercise: ExerciseType, answers: AnswerType[]) => {
            return exercise?.answerIds.map(ansId => {
                return answers?.find(ans => ans.id === ansId);
            });
        }
    );
    return selectExerciseAnswers;
};

export const makeSelectExerciseRankInStepper = () => {
    const selectExerciseStepperExercises = makeSelectExerciseStepperExercises();
    const selectExerciseRankInStepper = createSelector(
        [
          (state: RootState, stepperId: string) => selectExerciseStepperExercises(state, stepperId),
          (state: RootState, stepperId: string, exId: string) => exId,
        ],
        (exercises: ExerciseType[], exId: string) => {
            return exercises.map(ex => ex.id).indexOf(exId);
        }
    );
    return selectExerciseRankInStepper;
};

/**
 * An exercise, consisting of one or more questions with answering modalities.
 *
 * The interactive parts of an exercise are provided by answering components like `MultipleChoice`,
 * `MultipleAnswer` and `FillString`. The user enters their response via the answering component and
 * can get feedback on their given answers.
 * ```
 *
 * @prop {React.ReactNode} children The children of the exercise. Should contain some question text and one or more answer components.
 * @prop {boolean} showTitle If `true`, show a title above the exercise displaying the rank number of the exercise inside the current lesson.
 * ```
 */
export const Exercise = ({ children, showTitle=true}: ExerciseProps) => {
    const stepperContext = useContext(ExerciseStepperContext);
    const insideStepper = stepperContext !== null;

    const id = useId();
    let stepperId = useId();

    if (insideStepper) {
        stepperId = stepperContext?.id;
    }

    const selectExerciseStepperFromId = React.useMemo(makeSelectExerciseStepperFromId, []);
    const exerciseStepper = useSelector(state => selectExerciseStepperFromId(state, stepperId));

    const selectExerciseFromId = React.useMemo(makeSelectExerciseById, []);
    const exercise = useSelector(state => selectExerciseFromId(state, id));

    const selectExerciseAnswersFromId = React.useMemo(makeSelectExerciseAnswers, []);
    const answers = useSelector(state => selectExerciseAnswersFromId(state, id), compareAnswers);

    const nodeRef = useRef<HTMLDivElement>(null);

    let stepperRank = exerciseStepper?.rank;

    const dispatch = useDispatch();

    const selectExerciseRankInStepperFromId = React.useMemo(makeSelectExerciseRankInStepper, []);
    const rank = useSelector(state => selectExerciseRankInStepperFromId(state, stepperId, id));
    const name = getExerciseName({rank: rank, stepperRank: stepperRank, insideStepper: insideStepper});

    useEffect(() => {
        dispatch(
            exerciseAdded({
                id: id,
            })
        )
        return () =>  {
            dispatch(
                removeExercise({ id: id })
            );
        };
    }, []);

    useEffect(() => {
        if (insideStepper) {
            return;
        }
        dispatch(
            exerciseStepperAdded({
                id: stepperId,
            })
        )
        return () => {
            dispatch(
                removeExerciseStepper({ id: stepperId })
            );
        };
    }, []);

    useEffect(() => {
        dispatch(
            exerciseStepAdded({
                exerciseStepperId: stepperId,
                exerciseId: id,
            })
        )
    }, []);

    useEffect(() => {
        dispatch(
            exerciseNameChanged({
                id: id,
                name: name,
            })
        )
    }, [name]);

    const addAnswerId = (answerId: string) => {
        dispatch(
            exerciseAnswerAdded({
                exerciseId: id,
                answerId: answerId,
            })
        )
    }

    const allAnswered = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.answered || ans?.correct === null)
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

    const insideBare = React.useContext(BareLessonContext) !== null;
	  const title = (showTitle || insideBare) && name !== "" ? <h3>{ name }</h3> : null;

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
                    !allShowingSolutions && !insideBare ?
                    <Button variant="contained"
                        color="primary"
                        disabled={!allAnswered}
                        onClick={showSolutions} >
                        {"Toon oplossing"}
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
    insideStepper: boolean,
}

const getExerciseName = ({ rank, stepperRank, insideStepper }: ExerciseTitleProps) => {
    rank = rank || 0;
    let name = '';
    
    if (!insideStepper) {
        name += (stepperRank + 1);
    } else {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        name += (stepperRank + 1) + alphabet.charAt(rank % 26);
    }
    return `Oefening ${name}`;
};
