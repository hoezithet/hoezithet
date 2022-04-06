import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { ReadableAnswerSolution } from "./answerSolution"

import { selectAnswers, AnswerType } from './answer'
import { selectExercises } from './exercise'
import { selectExerciseSteppers } from './exerciseStepper'
import { useSelector } from 'react-redux'

type LessonAnswerSolutionProps = {
    answer: AnswerType<any>,
};


const useStyles = makeStyles({
    solutionsWrapper: {
        breakBefore: "always",
    }
});

const LessonAnswerSolution = ({ answer }: LessonAnswerSolutionProps) => {
    return (
        <div>
            <p>
                <b>Oplossing: </b>
                <ReadableAnswerSolution solution={ answer?.solution }/>
            </p>
            {
            answer?.explanation ?
            <p>
                <b>Uitleg: </b>
                { answer.explanation }
            </p>
            : null
            }
        </div>
    );
};

export const LessonSolutions = ({}) => {
    const answers = useSelector(selectAnswers);
    const exercises = useSelector(selectExercises);
    const classes = useStyles();

    const lessonAnswers = exercises.map(ex =>
        ex?.answerIds.map(exId => answers.find(ans => ans?.id === exId))
    );

    let alreadyRenderedExercises: string[] = [];
    const solutionElements: React.ReactElement[] = [];

    let looseAnswersCounter = 0;

    for (const answer of answers) {
        const idx = exercises.findIndex(ex => ex.answerIds.includes(answer.id));
        if (idx !== -1) {
            const exercise = exercises[idx];
            if (!alreadyRenderedExercises.includes(exercise.id)) {
                alreadyRenderedExercises.push(exercise.id);
                solutionElements.push(
                    <div key={exercise.id}>
                    <h3>{ exercise.name }</h3>
                    {
                        exercise.answerIds?.map(ansId => answers.find(ans => ans?.id === ansId))
                        .map(ans => 
                            ans !== undefined ? <LessonAnswerSolution answer={ans}/> : null
                        )
                    }
                    </div>
                );
            }
        } else if (answer !== undefined) {
            // TODO: Remove this, answers must always be inside an exercise
            looseAnswersCounter += 1;
            solutionElements.push(
                <div key={answer.id}>
                <h3>{ `Losse vraag ${looseAnswersCounter}` }</h3>
                {
                    <LessonAnswerSolution answer={answer} />
                }
                </div>
            )
        }
    }

    return (
       solutionElements.length > 0 ?
         <div className={classes.solutionsWrapper}>
             <h2>Oplossingen</h2>
             { solutionElements }
         </div>
       : null
    );
};
