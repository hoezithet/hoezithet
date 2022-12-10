import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'
import useId from 'hooks/useId';

import { answerAdded, answerChanged, removeAnswer } from '../../state/answersSlice'
import { ExerciseContext } from './exercise'


export type AnswerType<T> = {
    id: string,
    value: T|null,
    correct: boolean,
    answered: boolean,
    explanation?: string,
    solution: string,
    showingSolution: boolean,
};

export const selectAnswers = (state: RootState) => {
    return state.answers
};

export const compareAnswers = (answers1, answers2) => {
    if (answers1 === answers2) {
        return true;
    }
    return (
        answers1?.length === answers2?.length
        && answers1?.every((a1, idx) => {
            const a2 = answers2[idx];
            return (
                a1.value === a2.value
                && a1.id === a2.id
                && a1.showingSolution === a2.showingSolution
                && a1.trial === a2.trial
            );
        })
    );
};

export const makeSelectAnswerFromId = () => {
    const selectAnswerFromId = createSelector(
        [
            selectAnswers,
            (state: RootState, ansId: string) => ansId
        ],
        (answers: AnswerType[], ansId: string) => {
            return answers?.find(ans => ans.id === ansId);
        }
    );
    return selectAnswerFromId;
};

export function useAnswerValue<T> (
    evaluateAnswerValue: (v: T|null) => boolean|null,
    solution: string|string[],
    explanation: string,
): {answerValue: T|null, setAnswerValue: (newValue: T|null) => void, showingSolution: boolean} {
    const id = useId();
    const selectAnswerFromId = useMemo(makeSelectAnswerFromId, []);
    const answer = useSelector(state => selectAnswerFromId(state, id));

    const exCtx = useContext(ExerciseContext);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            answerAdded({
                id: id,
                value: null,
                correct: null,
                answered: false,
                solution: solution,
                explanation: explanation,
                showingSolution: false,
                trial: 0,
            })
        )
        if (exCtx !== null) {
            const { addAnswer } = exCtx;
            addAnswer(id);
        }

        return () => {
            dispatch(
                removeAnswer({ id: id })
            );
        };
    }, []);

    const setAnswerValue = (newValue: T|null) => {
        const correct = evaluateAnswerValue(newValue);
        const answered = correct === null || newValue !== null;
        // If correct is null, the answer has no user input,
        // so there's nothing to evaluate.
        dispatch(
            answerChanged({
                ...answer,
                value: newValue,
                correct: correct,
                answered: answered,
            })
        )
    };


    return {answerValue: answer?.value !== undefined ? answer.value : null, setAnswerValue: setAnswerValue, showingSolution: answer?.showingSolution || false, trial: answer?.trial};
}
