import React from "react";

import { Exercise } from "components/shortcodes/exercise";
import { ExerciseStepper } from "components/shortcodes/exerciseStepper";
import { MultipleChoice } from "components/shortcodes/multipleChoice";
import { Explanation } from "components/shortcodes/explanation";
import Md from "components/markdown";

const ex1 = String.raw`Vul aan: $1~\si{min}$ is gelijk aan`;
const ex1Choices = String.raw`$\frac{1}{60}~\si{h}$
$60~\si{h}$
$\frac{1}{3600}~\si{h}$ 
$3600~\si{h}$`.split('\n');
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
const ex2Choices = String.raw`$1{,}562~\si{h}$
$5623~\si{h}$
$0,02603~\si{h}$
$337~392~\si{h}$`.split('\n');
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

export default MinNaarUur;