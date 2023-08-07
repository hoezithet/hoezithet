import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from "components/katex";

const ex1Choices = [
    <K>{String.raw`\frac{1}{60}~\si{h}   `}</K>,
    <K>{String.raw`60~\si{h}             `}</K>,
    <K>{String.raw`\frac{1}{3600}~\si{h}`}</K>,
    <K>{String.raw`3600~\si{h}           `}</K>,
];

const ex2Choices = [
    <K>{String.raw`1{,}562~\si{h}  `}</K>,
    <K>{String.raw`5623~\si{h}     `}</K>,
    <K>{String.raw`0{,}02603~\si{h}`}</K>,
    <K>{String.raw`337~392~\si{h}  `}</K>,
];

const MinNaarUur = () => {
    return (
        <ExerciseStepper>
            <Exercise>
                Vul aan: <K>{String.raw`1~\si{min}`}</K> is gelijk aan
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        We weten dat
                        <K display>{String.raw`60~\si{min} = 1~\si{h}`}</K>
                        Door deze vergelijking te delen door <K>{String.raw`60`}</K>, krijgen we:
                        <K display>{String.raw`1~\si{min} = \frac{1}{60}~\si{h} `}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                Hoeveel uur zijn <K>{String.raw`93{,}72~\si{min}`}</K> dan?
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                        Uit de vorige vraag leerden we dat <K>{String.raw`1~\si{min} = \frac{1}{60}~\si{h}`}</K>. We kunnen de <K>{String.raw`\si{min}`}</K> in <K>{String.raw`93{,}72~\si{min}`}</K> dus vervangen door <K>{String.raw`\frac{1}{60}~\si{h}`}</K>:
                        <K display>{String.raw`
\begin{aligned}
93{,}72~\orange{\si{min}} &= 93{,}72\cdot \orange{\frac{1}{60}~\si{h}}\\
&= 1{,}562~\si{h}
\end{aligned}
`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};

export default MinNaarUur;
