import { createSlice } from '@reduxjs/toolkit'

import { AnswerType } from '../components/exercises/answer'


const initialState = [] as AnswerType<any>[];

const getIdxFromId = (state: typeof initialState, id: string) => {
    return state.findIndex(answer => answer.id === id);
}

const answersSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        answerAdded(state, action) {
            state.push(action.payload);
        },
        answerChanged(state, action) {
            const answerIdx = getIdxFromId(state, action.payload.id);
            if (answerIdx === -1) { return }
            state[answerIdx] = action.payload;
        },
        showAnswerSolution(state, action) {
            const answerIdx = getIdxFromId(state, action.payload.id);
            if (answerIdx === -1) { return }
            state[answerIdx]['showingSolution'] = true;
        },
        resetAnswer(state, action) {
            const answerIdx = getIdxFromId(state, action.payload.id);
            if (answerIdx === -1) { return }
            state[answerIdx] = {
                ...state[answerIdx],
                value: null,
                answered: false,
                correct: false,
                showingSolution: false,
                trial: state[answerIdx].trial + 1,
            };
        },
        removeAnswer(state, action) {
            const answerIdx = getIdxFromId(state, action.payload.id);
            if (answerIdx === -1) { return }
            state.splice(answerIdx, 1);
        },
    }
})

export const { answerAdded, answerChanged, showAnswerSolution, resetAnswer, removeAnswer } = answersSlice.actions

export default answersSlice.reducer
