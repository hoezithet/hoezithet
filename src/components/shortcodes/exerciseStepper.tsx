import React, { useState, useCallback, useRef, createContext, useEffect } from 'react';

import Step from '@material-ui/core/Step';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import styled from "styled-components";
import SwipeableViews from 'react-swipeable-views';

import { theme } from "../theme";
import { ExerciseType, selectExercises } from "./exercise";
import { ExercisesFeedback } from "./exerciseFeedback";
import COLORS from 'colors';
import { AnswerType, selectAnswers, compareAnswers } from './answer';

import { RootState } from 'state/store'
import { exerciseStepperAdded, exerciseStepAdded, removeExerciseStepper } from '../../state/exerciseSteppersSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid, createSelector } from '@reduxjs/toolkit'
import { showAnswerSolution, resetAnswer } from 'state/answersSlice'
import BareLessonContext from "contexts/bareLessonContext";


interface ExerciseStepperProps {
    children: React.ReactNode;
}

const StyledPaper = styled(Paper)`
    padding: ${theme.spacing(2)}px;
    margin: ${theme.spacing(1)}px;
    break-inside: avoid;
`;

const StyledStepper = styled(Stepper)`
    background-color: transparent;
`;

const StyledStep = styled(Step)`
    cursor: pointer;
`;

const ExercisesFeedbackDiv = styled.div`
    text-align: center;
    margin: ${theme.spacing(2)}px;
`;


function ExerciseStepIcon(props: StepIconProps) {
    const Icon = props.completed ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;

    return (
        <Icon color={props.active ? "primary" : "disabled"} />
    );
}

const NextPrevBtnGrid = styled(Grid)`
    margin-top: ${theme.spacing(1)}px;
`

const getExerciseStepsFromChildren = (children: React.ReactNode) => {
    return React.Children.toArray(children);
};

type ExerciseStepperContextValueType = {
    id: string,
    addExercise: (exerciseId: string) => void,
    rank: number,
}

export const ExerciseStepperContext = createContext<ExerciseStepperContextValueType|null>(null);

export const selectExerciseSteppers = (state: RootState) => state.exerciseSteppers;

export const makeSelectExerciseStepperFromId = () => {
    const selectExerciseStepperFromId = createSelector(
        [
          (state: RootState) => selectExerciseSteppers(state),
          (state: RootState, stepperId: string) => stepperId,
        ],
        (exerciseSteppers: ExerciseStepperType[], stepperId: string) => {
            return exerciseSteppers?.find(
                stepper => stepper.id === stepperId
            );
        }
    );
    return selectExerciseStepperFromId;
};

export const makeSelectExerciseStepperExercises = () => {
    const selectExerciseStepperFromId = makeSelectExerciseStepperFromId();

    const selectExerciseStepperExercises = createSelector(
        [
            (state: RootState, stepperId: string) => selectExerciseStepperFromId(state, stepperId),
            (state: RootState) => selectExercises(state),
        ],
        (exerciseStepper: ExerciseStepperType, exercises: ExerciseType[]) => {
            return exercises.filter(ex => exerciseStepper?.exerciseIds?.includes(ex.id));
        }
    );
    return selectExerciseStepperExercises;
};

export const makeSelectExerciseStepperAnswers = () => {
    const selectExerciseStepperExercises = makeSelectExerciseStepperExercises();

    const selectExerciseStepperAnswers = createSelector(
        [
            (state: RootState, stepperId: string) => selectExerciseStepperExercises(state, stepperId),
            (state: RootState) => selectAnswers(state),
        ],
        (exercises: ExerciseType[], answers: AnswerType[]) => {
            return exercises?.map(
                ex => ex?.answerIds.map(ansId =>
                    answers.find(ans => ansId === ans?.id)
                )
            );
        }
    );
    return selectExerciseStepperAnswers;
};

const flattenAnswers = answers => answers.reduce((acc, curVal) => acc?.concat(curVal), []);

export type ExerciseStepperType = {
    id: string,
    exerciseIds: string[],
    rank: number,
}

/**
 * A set of multiple consecutive exercises, presented as a stepper.
 *
 * After the user has completed all exercises, a score will be shown and the user
 * can review their answers, check the solution and view the explanation for the
 * solution of each answer.
 *
 * For example, the following `ExerciseStepper` will contain two exercises:
 *
 * ```jsx
 * <ExerciseStepper>
 *   <Exercise>
 *     2 + 5 is equal to
 *     <MultipleChoice choices={[4, 7, -5]} solution={1}>
 *       <Explanation>
 *         If you'd be standing at number 2 on a number line and would take 5 steps to the right, you'll end up standing at number 7.
 *       </Explanation>
 *     </MultipleChoice>
 *   </Exercise>
 *   <Exercise>
 *     4 + 2 is equal to
 *     <MultipleChoice choices={[6, 7, 9]} solution={0}>
 *       <Explanation>
 *         If you'd be standing at number 4 on a number line and would take 2 steps to the right, you'll end up standing at number 6.
 *       </Explanation>
 *     </MultipleChoice>
 *   </Exercise>
 * </ExerciseStepper>
 * ``` 
 *
 * @prop {ExerciseStepperProps} children: Each direct child should be an `Exercise` component.
 */
export const ExerciseStepper = ({ children }: ExerciseStepperProps) => {
    const id = useRef(nanoid());
    const steps = getExerciseStepsFromChildren(children);

    const selectExerciseStepperFromId = React.useMemo(makeSelectExerciseStepperFromId, []);
    const exerciseStepper = useSelector(state => selectExerciseStepperFromId(state, id.current));

    const selectExerciseStepperAnswersFromId = React.useMemo(makeSelectExerciseStepperAnswers, []);
    const answers = useSelector(state => {
        return selectExerciseStepperAnswersFromId(state, id.current);
    },
    (answersAfter, answersBefore) => {
        answersBefore = flattenAnswers(answersBefore);
        answersAfter = flattenAnswers(answersAfter);
        return compareAnswers(answersBefore, answersAfter);
    });
    const flatAnswers = flattenAnswers(answers);

    const dispatch = useDispatch();

    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        dispatch(
            exerciseStepperAdded({
                id: id.current,
            })
        )
        return () => { removeExerciseStepper({ id: id.current }) };
    }, []);

    useEffect(() => {
        if (allStepsCompleted() && isResultStep()) {
            showSolutions();
        }
    }, [activeStep]);

    const addExerciseId = (exerciseId: string) => {
        dispatch(
            exerciseStepAdded({
                exerciseStepperId: id.current,
                exerciseId: exerciseId,
            })
        )
    };

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const isResultStep = () => {
        return activeStep === totalSteps();
    };

    const handleNext = () => {
        handleStepChange(activeStep + 1);
    };

    const handleBack = () => {
        handleStepChange(activeStep - 1);
    };
    
    const showSolutions = () => {
        flatAnswers?.forEach(ans => {
            dispatch(
                showAnswerSolution({
                    id: ans?.id
                })
            )
        });
    };

    const handleStep = (step: number) => () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted() && step > activeStep
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has not been completed
                (answers?.map((_ans, i) => i).find(i => !stepCompleted(i)) || step)
                : step;
        setActiveStep(newActiveStep % (allStepsCompleted() ? steps.length + 1 : steps.length));
    };

    const handleStepChange = (step: number) => {
        handleStep(step)();
    };

    const handleReset = () => {
        flatAnswers?.forEach(ans => {
            dispatch(
                resetAnswer({
                    id: ans?.id
                })
            )
        });
        setActiveStep(0);
    };

    const isShowingSolutions = () => {
        return flatAnswers?.every(ans => ans?.showingSolution) || false
    };
    
    const getStepAnswers = (step: number) => {
        if (!Array.isArray(answers)) { return null }
        return answers[step];
    };
    
    const stepCompleted = (step: number) => {
        const stepAnswers = getStepAnswers(step);
        return stepAnswers?.every(a => a?.answered) || false;
    };

    const allStepsCompleted = () => {
        return answers?.every((_exAnswers, index) => stepCompleted(index));
    };

    const stepCorrect = (step: number) => {
        const stepAnswers = getStepAnswers(step);
        return  stepAnswers?.every(a => a?.correct) || false;
    };
    
    const getScore = () => {
        return answers?.reduce((acc, _exAnswers, idx) => stepCorrect(idx) ? acc + 1 : acc, 0) || 0;
    };

    const views = (
        steps.map((step, index) =>
            <StyledPaper key={index} elevation={1}>
                {step}
                <NextPrevBtnGrid container spacing={2}>
                    <Grid item>
                        <Button disabled={activeStep === 0} onClick={handleBack} >
                            { "Vorige" }
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"
                            color="primary"
                            disabled={!stepCompleted(index) && answers?.filter((_exAns, i) => i !== index).every((_ex, i) => stepCompleted(i))}
                            onClick={handleNext}>
                            {index === steps.length - 1 && allStepsCompleted() ? 'Klaar' : 'Volgende'}
                        </Button>
                    </Grid>
                </NextPrevBtnGrid>
            </StyledPaper>
        )
    );

    views.push(
        <StyledPaper key={views.length} >
          <ExercisesFeedbackDiv>
            { isShowingSolutions() ?
                <>
                <ExercisesFeedback nCorrect={getScore()} nTotal={steps.length || 0} />
                <NextPrevBtnGrid container spacing={2}>
                    <Grid item>
                        <Button onClick={handleReset}>
                            { "Begin opnieuw" }
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"
                            color="primary"
                            onClick={handleNext}>
                            { "Toon feedback" }
                        </Button>
                    </Grid>
                </NextPrevBtnGrid>
                </>
                :
                <CircularProgress />
            }
          </ExercisesFeedbackDiv>
        </StyledPaper>
    );
    
    const stepperCtx = {
        id: id.current,
        addExercise: addExerciseId,
        rank: exerciseStepper?.rank,
    };

    const bareContext = React.useContext(BareLessonContext);
    if (bareContext !== null) {
	    return (
	        <ExerciseStepperContext.Provider value={stepperCtx}>
	            {steps.map((step, index) =>
                    <StyledPaper key={index} elevation={1}>
                        {step}
                    </StyledPaper>
                )}
	        </ExerciseStepperContext.Provider>
	    );
    }
    return (
        <ExerciseStepperContext.Provider value={stepperCtx}>
            <StyledStepper nonLinear activeStep={activeStep}>
                {steps.map((_step, index) => (
                    <StyledStep key={index}>
                        <StepLabel
                            StepIconComponent={ExerciseStepIcon}
                            StepIconProps={
                                {
                                    active: activeStep === index,
                                    completed: stepCompleted(index),
                                }
                            }
                            onClick={handleStep(index)} />
                    </StyledStep>
                ))}
            </StyledStepper>
            <SwipeableViews index={activeStep} onChangeIndex={handleStepChange} disableLazyLoading>
                { views }
            </SwipeableViews>
        </ExerciseStepperContext.Provider>
    );
}
