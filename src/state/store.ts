import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import answersReducer from './answersSlice'
import exerciseReducer from './exercisesSlice'
import exerciseSteppersReducer from './exerciseSteppersSlice'


const store = configureStore({
    reducer: {
        answers: answersReducer,
        exercises: exerciseReducer,
        exerciseSteppers: exerciseSteppersReducer,
    },
	middleware: getDefaultMiddleware({
		serializableCheck: {
			// Ignore these action types
            ignoredActions: [
                'answers/answerAdded', 'answers/answerChanged', 'answers/resetAnswer',
                'exerciseSteppers/exerciseStepAdded', 'exercises/exerciseAnswerAdded',
                'exerciseSteppers/exerciseStepperAdded', 'exercises/exerciseAdded',
            ],
		},
	}),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
