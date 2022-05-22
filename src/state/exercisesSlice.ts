import { createSlice } from '@reduxjs/toolkit'

import { ExerciseType } from '../components/exercises/exercise'
import { RootState } from './store'


const initialState = [] as ExerciseType[];

const getIdxFromId = (state: typeof initialState, id: string) => {
    return state.findIndex(exercise => exercise.id === id);
}

const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        exerciseAdded(state, action) {
            const exIdx = getIdxFromId(state, action.payload.id);
            if (exIdx !== -1) {
                // If the exercise exists already, do nothing
                return;
            } else {
                state.push({
                    id: action.payload.id,
                    name: "",
                    answerIds: [],
                    showingSolution: false,
                    rank: state.length
                });
            }
        },
        exerciseChanged(state, action) {
            const idx = getIdxFromId(state, action.payload.id);
            if (idx === -1) { return }
            state[idx] = action.payload;
        },
        exerciseNameChanged(state, action) {
            const idx = getIdxFromId(state, action.payload.id);
            if (idx === -1) { return }
            state[idx]['name'] = action.payload.name;
        },
        exerciseAnswerAdded(state, action) {
            const exIdx = getIdxFromId(state, action.payload.exerciseId);
            if (exIdx === -1) {
                // If the exercise doesn't exist yet, create it
                state.push({
                    id: action.payload.exerciseId,
                    answerIds: [action.payload.answerId],
                    showingSolution: false,
                    rank: state.length
                });
            } else {
                state[exIdx]['answerIds'].push(action.payload.answerId);
            }
        },
        removeExercise(state, action) {
            const exIdx = getIdxFromId(state, action.payload.id);
            if (exIdx === -1) { return }
            state.splice(exIdx, 1);
        },
    }
})

export const { exerciseAdded, exerciseChanged, exerciseAnswerAdded, exerciseNameChanged, removeExercise } = exercisesSlice.actions

export default exercisesSlice.reducer
