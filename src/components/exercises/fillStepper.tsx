import React from "react";
import Grid from '@mui/material/Grid';

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { FillString } from "components/exercises/fillAnswer";
import Md from "components/markdown";

const FillStepper = ({
    texts, solutions, explanations, Wrapper=Md
}) => {
    return (
        <ExerciseStepper>
            {
                texts.map((text, i) => (
                    <React.Fragment key={i}>
                        <Exercise>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Wrapper>{ text }</Wrapper>
                                </Grid>
                                <Grid item xs={12}>
                                    <FillString solution={solutions[i]}>
                                        { explanations[i] }
                                    </FillString>
                                </Grid>
                            </Grid>
                        </Exercise>
                    </React.Fragment>
                ))
            }
        </ExerciseStepper>
    );
};

export default FillStepper;
