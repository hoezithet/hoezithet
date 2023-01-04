import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";
import { Katex as K } from "components/katex";

const ex1 = String.raw`Vul aan: $1~\si{m}$ is gelijk aan`;
const ex1Choices = [
    <K>{String.raw`10~\si{dm}    `}</K>,
    <K>{String.raw`0{,}10~\si{dm}`}</K>,
    <K>{String.raw`100~\si{dm}   `}</K>,
    <K>{String.raw`0{,}01~\si{dm}`}</K>,
];
const ex1Expl = String.raw`
Het voorvoegsel $\si{d}$ (deci-) betekent "een tiende", of $0{,}1$. $1~\si{dm}$ is dus een tiende meter of $0{,}1~\si{m}$. Om één meter te krijgen, hebben we **tien** tiende meters nodig. $1~\si{m}$ is dus gelijk aan $10~\si{dm}$.
`;

const ex2 = String.raw`
Hoeveel decimeter is $1{,}84~\si{m}$ dan?
`;
const ex2Choices = [
    <K>{String.raw`18{,}4~\si{dm} `}</K>,
    <K>{String.raw`0{,}184~\si{dm}`}</K>,
    <K>{String.raw`184~\si{dm}    `}</K>,
    <K>{String.raw`1{,}84~\si{dm} `}</K>,
];
const ex2Expl = String.raw`
Uit de vorige vraag leerden we dat $1~\si{m} = 10~\si{dm}$. We kunnen de $\si{m}$ in $1{,}84~\si{m}$ dus vervangen door $10~\si{dm}$:

$$
\begin{aligned}
1{,}84~\orange{\si{m}} &= 1{,}84\cdot \orange{10~\si{dm}}\\
&= 18{,}4~\si{dm}
\end{aligned}
$$ 
`;

const MeterNaarDecimeter = () => {
    
    return (
        <ExerciseStepper>
            <Exercise>
                <Md>{ ex1 }</Md>
                <MultipleChoice choices={ex1Choices} solution={0}>
                    { ex1Expl }
                </MultipleChoice>
            </Exercise>
            <Exercise>
                <Md>{ ex2 }</Md>
                <MultipleChoice choices={ex2Choices} solution={0}>
                    { ex2Expl }
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};

export default MeterNaarDecimeter;
