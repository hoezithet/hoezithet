import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";


const MultipleChoiceStepper = ({
    texts, choices, explanations=null, solutions=null, Wrapper=Md
}) => {
    return (
        <ExerciseStepper>
            {
                texts.map((text, i) => (
                    <React.Fragment key={i}>
                        <Exercise>
                            <Wrapper>{ text }</Wrapper>
                            <MultipleChoice choices={choices[i]} solution={solutions !== null ? solutions[i] : 0}>
                                { explanations !== null ? explanations[i] : null }
                            </MultipleChoice>
                        </Exercise>
                    </React.Fragment>
                ))
            }
        </ExerciseStepper>
    );
};

export default MultipleChoiceStepper;
