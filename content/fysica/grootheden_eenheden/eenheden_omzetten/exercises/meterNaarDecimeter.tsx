import React from "react";

import { Exercise } from "components/shortcodes/exercise";
import { ExerciseStepper } from "components/shortcodes/exerciseStepper";
import { MultipleChoice } from "components/shortcodes/multipleChoice";
import { Explanation } from "components/shortcodes/explanation";
import Md from "components/markdown";

const ex1 = String.raw`Vul aan: $1~\si{m}$ is gelijk aan`;
const ex1Choices = String.raw`$10~\si{dm}$
$0{,}10~\si{dm}$
$100~\si{dm}$
$0{,}01~\si{dm}$`.split('\n');
const ex1Expl = String.raw`
Het voorvoegsel $\si{d}$ (deci-) betekent "een tiende", of $0{,}1$. $1~\si{dm}$ is dus een tiende meter of $0{,}1~\si{m}$. Om één meter te krijgen, hebben we **tien** tiende meters nodig. $1~\si{m}$ is dus gelijk aan $10~\si{dm}$.
`;

const ex2 = String.raw`
Hoeveel decimeter is $1{,}84~\si{m}$ dan?
`;
const ex2Choices = String.raw`$18{,}4~\si{dm}$
$0{,}184~\si{dm}$
$184~\si{dm}$
$1{,}84~\si{dm}$`.split('\n');
const ex2Expl = String.raw`
Uit de vorige vraag leerden we dat $1~\si{m} = 10~\si{dm}$. We kunnen de $\si{m}$ in $1{,}84~\si{m}$ dus vervangen door $10~\si{dm}$:

$$
\begin{aligned}
1{,}84~\si{m} &= 1{,}84\cdot \orange{1~\si{m}}\\
&= 1{,}84\cdot \orange{10~\si{dm}}\\
&= 18{,}4~\si{dm}
\end{aligned}
$$ 
`;

const MeterNaarDecimeter = () => {
    
    return (
        <ExerciseStepper>
            <Exercise>
                <Md>{ ex1 }</Md>
                <MultipleChoice choices={ex1Choices.map(c => <Md>{c}</Md>)} solution={0}>
                <Explanation>
                    <Md>{ ex1Expl }</Md>
                </Explanation>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                <Md>{ ex2 }</Md>
                <MultipleChoice choices={ex2Choices.map(c => <Md>{c}</Md>)} solution={0}>
                <Explanation>
                    <Md>{ ex2Expl }</Md>
                </Explanation>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};

export default MeterNaarDecimeter;