import { createSlice } from '@reduxjs/toolkit'

import { ExerciseStepperType } from '../components/shortcodes/exerciseStepper'
import { RootState } from './store'


const initialState = [] as ExerciseStepperType[];

const getIdxFromId = (state: typeof initialState, id: string) => {
    return state.findIndex(exerciseStepper => exerciseStepper.id === id);
}

const exerciseSteppersSlice = createSlice({
    name: 'exerciseSteppers',
    initialState,
    reducers: {
        exerciseStepperAdded(state, action) {
            const id = action.payload.id;
            const stepperIdx = getIdxFromId(state, id);
            if (stepperIdx === -1) {
                // Only push if the stepper doesn't exist yet
                state.push({
                    id: id,
                    exerciseIds: [],
                    rank: state.length,
                });
            }
        },
        exerciseStepAdded(state, action) {
            const stepperId = action.payload.exerciseStepperId;
            const stepperIdx = getIdxFromId(state, stepperId);
            if (stepperIdx === -1) {
                // If the exercise stepper doesn't exist yet, create it
                state.push({
                    id: stepperId,
                    exerciseIds: [action.payload.exerciseId],
                    rank: state.length,
                });
            } else {
                const exId = action.payload.exerciseId;
                if (!Array.isArray(state[stepperIdx]['exerciseIds'])) {
                    state[stepperIdx]['exerciseIds'] = [exId];
                } else {
                    state[stepperIdx]['exerciseIds'].push(exId);
                }
            }
        },
        removeExerciseStepper(state, action) {
            const stepperIdx = getIdxFromId(state, action.payload.id);
            if (stepperIdx === -1) { return }
            state.splice(stepperIdx, 1);
        },
    }
})

export const { exerciseStepperAdded, exerciseStepAdded, removeExerciseStepper } = exerciseSteppersSlice.actions

export default exerciseSteppersSlice.reducer
