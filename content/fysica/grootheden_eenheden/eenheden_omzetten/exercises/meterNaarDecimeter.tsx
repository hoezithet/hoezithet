import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from "components/katex";

const ex1Choices = [
    <K>{String.raw`10~\si{dm}    `}</K>,
    <K>{String.raw`0{,}10~\si{dm}`}</K>,
    <K>{String.raw`100~\si{dm}   `}</K>,
    <K>{String.raw`0{,}01~\si{dm}`}</K>,
];

const ex2Choices = [
    <K>{String.raw`18{,}4~\si{dm} `}</K>,
    <K>{String.raw`0{,}184~\si{dm}`}</K>,
    <K>{String.raw`184~\si{dm}    `}</K>,
    <K>{String.raw`1{,}84~\si{dm} `}</K>,
];

const MeterNaarDecimeter = () => {
    
    return (
        <ExerciseStepper>
            <Exercise>
                Vul aan: <K>{String.raw`1~\si{m}`}</K> is gelijk aan
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        Het voorvoegsel <K>{String.raw`\si{d}`}</K> (<em>deci-</em>) betekent <em>een tiende</em>, of <K>{String.raw`0{,}1`}</K>. <K>{String.raw`1~\si{dm}`}</K> is dus een tiende meter of <K>{String.raw`0{,}1~\si{m}`}</K>. Om één meter te krijgen, hebben we <b>tien</b> tiende meters nodig. <K>{String.raw`1~\si{m}`}</K> is dus gelijk aan <K>{String.raw`10~\si{dm}`}</K>.
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                Hoeveel decimeter is <K>{String.raw`1{,}84~\si{m}`}</K> dan?
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                        Uit de vorige vraag leerden we dat <K>{String.raw`1~\si{m} = 10~\si{dm}`}</K>. We kunnen de <K>{String.raw`\si{m}`}</K> in <K>{String.raw`1{,}84~\si{m}`}</K> dus vervangen door <K>{String.raw`10~\si{dm}`}</K>:
                        <K display>{String.raw`
\begin{aligned}
1{,}84~\orange{\si{m}} &= 1{,}84\cdot \orange{10~\si{dm}}\\
&= 18{,}4~\si{dm}
\end{aligned}
`}</K>
</div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};

export default MeterNaarDecimeter;
