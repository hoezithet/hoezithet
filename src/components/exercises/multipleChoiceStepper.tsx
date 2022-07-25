import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";


const MultipleChoiceStepper = ({
    texts, choices, explanations
}) => {
    return (
        <ExerciseStepper>
            {
                texts.map((text, i) => (
                    <React.Fragment key={i}>
                        <Exercise>
                            <Md>{ text }</Md>
                            <MultipleChoice choices={choices[i]} solution={0}>
                                { explanations[i] }
                            </MultipleChoice>
                        </Exercise>
                    </React.Fragment>
                ))
            }
        </ExerciseStepper>
    );
};

export default MultipleChoiceStepper;
