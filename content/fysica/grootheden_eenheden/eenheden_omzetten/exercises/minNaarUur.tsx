import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";
import { Katex as K } from "components/katex";

const ex1 = String.raw`Vul aan: $1~\si{min}$ is gelijk aan`;
const ex1Choices = [
    <K>{String.raw`\frac{1}{60}~\si{h}   `}</K>,
    <K>{String.raw`60~\si{h}             `}</K>,
    <K>{String.raw`\frac{1}{3600}~\si{h}`}</K>,
    <K>{String.raw`3600~\si{h}           `}</K>,
];
const ex1Expl = String.raw`
We weten dat

$$
60~\si{min} = 1~\si{h}
$$

Door deze vergelijking te delen door $60$, krijgen we:

$$
1~\si{min} = \frac{1}{60}~\si{h} 
$$
`;

const ex2 = String.raw`
Hoeveel uur zijn $93{,}72~\si{min}$ dan?
`;
const ex2Choices = [
    <K>{String.raw`1{,}562~\si{h}  `}</K>,
    <K>{String.raw`5623~\si{h}     `}</K>,
    <K>{String.raw`0{,}02603~\si{h}`}</K>,
    <K>{String.raw`337~392~\si{h}  `}</K>,
];
const ex2Expl = String.raw`
Uit de vorige vraag leerden we dat $1~\si{min} = \frac{1}{60}~\si{h}$. We kunnen de $\si{min}$ in $93{,}72~\si{min}$ dus vervangen door $\frac{1}{60}~\si{h}$:

$$
\begin{aligned}
93{,}72~\orange{\si{min}} &= 93{,}72\cdot \orange{\frac{1}{60}~\si{h}}\\
&= 1{,}562~\si{h}
\end{aligned}
$$ 
`;

const MinNaarUur = () => {
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

export default MinNaarUur;
