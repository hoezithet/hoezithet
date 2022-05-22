import React, { useContext, useRef } from "react";

import { AnswerFeedback } from './answerFeedback';
import { AnswerType } from './answer';
import { ExerciseContext, ExerciseContextValueType } from './exercise'
import Button from '@material-ui/core/Button';

import { useDispatch } from 'react-redux'
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'


type WithFeedbackProps = {
    solution: React.ReactNode,
    explanation?: React.ReactNode,
    correct: boolean,
    children: React.ReactNode
};

export const withFeedback = <P extends object, T>(Component: React.ComponentType<P>): React.FC<P & WithFeedbackProps> => {
    return (props: WithFeedbackProps) => {
        const id = useRef("");
        const answer = useSelector(
            (state: RootState) => state.answers.find(ans => ans.id === id.current)
        );
        const {vars, addAnswer} = useContext(ExerciseContext);
        const showFeedback = answer?.showingSolution;
        const addAnswerId = (ansId: string) => {
            id.current = ansId;
            addAnswer(ansId);
        };

        const dispatch = useDispatch();
        const showSolutions = () => {
            dispatch(
                showAnswerSolution({
                    id: answer?.id
                })
            )
        };


        const ctxValRef = useRef<ExerciseContextValueType>({
            vars: vars,
            addAnswer: addAnswerId,
        });

        return (
            <ExerciseContext.Provider value={ctxValRef.current}>
                <Component {...(props as P)} />
                {showFeedback ? (
                    <AnswerFeedback
                        solution={answer?.solution}
                        explanation={answer?.explanation}
                        correct={answer?.correct || false}
                    />
                ) : null}
            </ExerciseContext.Provider>
        );
    };
};
