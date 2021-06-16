import React, { createContext, useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { useStoredElement, Store, GetNextElementsType } from '../store';
import { AnswerType, useAnswers } from "./answer";
import { ExerciseStepperContext } from './exerciseStepper';
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';

import { RootState } from '../../state/store'
import { exerciseAdded, exerciseAnswerAdded, removeExercise } from '../../state/exercisesSlice';
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice'


export type ExerciseType = {
    id: string,
    answerIds: string[],
    showingSolution: boolean,
    rank: number
}

type ExerciseProps = {
	children: React.ReactNode,
	showTitle: boolean
}

type ExerciseContextValueType = ((answerId: string) => void);

export const ExerciseContext = createContext<ExerciseContextValueType|null>(null);


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

export const Exercise = ({ children, showTitle=false }: ExerciseProps) => {
    const id = useRef(nanoid());

    const exercise = useExercise(id.current);
    const answers = useExerciseAnswers(id.current);

    const addExerciseIdToStepper = useContext(ExerciseStepperContext);
    const dispatch = useDispatch();

    if (!exercise) {
        dispatch(
            exerciseAdded({
                id: id.current,
            })
        )
        if (addExerciseIdToStepper !== null) {
            addExerciseIdToStepper(id.current)
        }
    }

    useEffect(() => {
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
	const title = showTitle && exercise?.rank !== undefined ? <ExerciseTitle rank={exercise?.rank}/> : null;

    return (
        <ExerciseContext.Provider value={addAnswerId}>
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
        </ExerciseContext.Provider>
    );
};

type ExerciseTitleProps = {
	rank: number,
}

const ExerciseTitle = ({ rank }: ExerciseTitleProps) => <h3>{ `Oefening ${(rank || 0) + 1} ` }</h3>;

export const TitledExercise = (props: ExerciseProps) => {
	return <Exercise {...props} showTitle={ true } />;
};
