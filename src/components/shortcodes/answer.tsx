import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'

import { answerAdded, answerChanged, removeAnswer } from '../../state/answersSlice'
import { ExerciseContext } from './exercise'


export type AnswerType<T> = {
    id: string,
    value: T|null,
    correct: boolean,
    answered: boolean,
    explanation?: React.ReactNode,
    solution: React.ReactNode,
    showingSolution: boolean,
};

export const selectAnswers = (state: RootState) => state.answers;

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
    evaluateAnswerValue: (v: T|null) => boolean,
    solution: React.ReactNode|React.ReactNode[],
    explanation: React.ReactNode,
): {answerValue: T|null, setAnswerValue: (newValue: T|null) => void, showingSolution: boolean} {
    const id = useRef(nanoid());
    const selectAnswerFromId = useMemo(makeSelectAnswerFromId, []);
    const answer = useSelector(state => selectAnswerFromId(state, id.current));

    const exCtx = useContext(ExerciseContext);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            answerAdded({
                id: id.current,
                value: null,
                correct: false,
                answered: false,
                solution: solution,
                explanation: explanation,
                showingSolution: false,
            })
        )
        if (exCtx !== null) {
            const { addAnswer } = exCtx;
            addAnswer(id.current);
        }

        return () => { removeAnswer({ id: id.current }) };
    }, []);

    const setAnswerValue = (newValue: T|null) => {
        dispatch(
            answerChanged({
                ...answer,
                value: newValue,
                correct: evaluateAnswerValue(newValue),
                answered: newValue !== null,
            })
        )
    };


    return {answerValue: answer?.value !== undefined ? answer.value : null, setAnswerValue: setAnswerValue, showingSolution: answer?.showingSolution || false};
}
