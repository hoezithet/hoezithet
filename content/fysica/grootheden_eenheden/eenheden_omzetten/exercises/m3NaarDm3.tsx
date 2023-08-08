import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from "components/katex";

const ex1Choices = [
    <K>{String.raw`\left(10^{0}\right)^3 `}</K>,
    <K>{String.raw`\left(10^{-1}\right)^3`}</K>,
    <K>{String.raw`\left(10^{1}\right)^3 `}</K>,
    <K>{String.raw`\left(10^{2}\right)^3 `}</K>,
];

const ex2Choices = [
    <K>{String.raw`\left(10^{-1}\right)^3`}</K>,
    <K>{String.raw`\left(10^{0}\right)^3 `}</K>,
    <K>{String.raw`\left(10^{1}\right)^3 `}</K>,
    <K>{String.raw`\left(10^{2}\right)^3 `}</K>,
];

const ex3Choices = [
    <K>{String.raw`15{,}0~\si{m}^3 = 15{,}0\cdot 10^{3}~\si{dm}^3 `}</K>,
    <K>{String.raw`15{,}0~\si{m}^3 = 15{,}0\cdot 10^{-3}~\si{dm}^3`}</K>,
    <K>{String.raw`15{,}0~\si{m}^3 = 150~\si{dm}^3                `}</K>,
    <K>{String.raw`15{,}0~\si{m}^3 = 1{,}50~\si{dm}^3             `}</K>,
];

const M3NaarDm3 = () => {
    return (
        <ExerciseStepper>
            <Exercise>
                Bij de eenheid <K>{String.raw`\si{m}^3`}</K> staat <b>geen voorvoegsel</b> en een <b>exponent <K>{String.raw`3`}</K></b>. Welke macht van <K>{String.raw`10`}</K> hoort hier dan bij?
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        Zoals je in de tabel met voorvoegsels kan zien, komt <em>geen voorvoegsel</em> overeen met <K>{String.raw`10^{0}`}</K>. Er staat een exponent <K>{String.raw`3`}</K> bij onze eenheid, die moeten we ook bij onze macht van <K>{String.raw`10`}</K> zetten.
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                Bij de eenheid <K>{String.raw`\si{dm}^3`}</K> staat <b>het voorvoegsel <K>{String.raw`\si{d}`}</K> (<em>deci-</em>)</b> en een <b>exponent <K>{String.raw`3`}</K></b>. Welke macht van <K>{String.raw`10`}</K> hoort hier dan bij?
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                    Zoals je in de tabel met voorvoegsels kan zien, komt <em>deci-</em> overeen met <K>{String.raw`10^{-1}`}</K>. Er staat een exponent <K>{String.raw`3`}</K> bij onze eenheid, die moeten we ook bij onze macht van <K>{String.raw`10`}</K> zetten.
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                Zet <K>{String.raw`15{,}0~\si{m}^3`}</K> om naar <K>{String.raw`\si{dm}^3`}</K>.
                <MultipleChoice choices={ex3Choices} solution={0}>
                    <div>
                        Om <K>{String.raw`15{,}0~\si{m}^3`}</K> om te kunnen zetten naar <K>{String.raw`\si{dm}^3`}</K>, moeten we eerst weten waaraan <K>{String.raw`1~\si{m}^3`}</K> gelijk is:
                        <K display>{String.raw`1~\si{m}^3 = \ldots~\si{dm}^3`}</K>
                        We leerden in de vorige paragraaf dat op de puntjes een breuk moet komen met in de teller de macht van <K>{String.raw`10`}</K> die overeenkomt met het voorvoegsel waar we vandaan komen en in de noemer de macht van <K>{String.raw`10`}</K> die overeenkomt met het voorvoegsel waar we naartoe gaan. Bij <K>{String.raw`\si{m}^3`}</K> hoort <K>{String.raw`\left(10^0\right)^3 = 10^0`}</K> en bij <K>{String.raw`\si{dm}^3`}</K> hoort <K>{String.raw`\left(10^{-1}\right)^3 = 10^{-3}`}</K>. In de teller komt dus <K>{String.raw`10^0`}</K> en in de noemer komt <K>{String.raw`10^{-3}`}</K>:
                        <K display>{String.raw`1~\si{m}^3 = \frac{10^0}{10^{-3}}~\si{dm}^3`}</K>
                        We kunnen deze breuk verder vereenvoudigen:
                        <K display>{String.raw`
                            \begin{aligned}
                            1~\si{m}^3 &= \frac{10^0}{10^{-3}}~\si{dm}^3\\
                            &= 10^{0 - (-3)}~\si{dm}^3\\
                            &= 10^3~\si{dm}^3\\
                            \end{aligned}`}</K>
                        We vinden dus dat
                        <K display>{String.raw`1~\si{m}^3 = 10^3~\si{dm}^3`}</K>
                        Dit kunnen we gebruiken om <K>{String.raw`15{,}0~\si{m}^3`}</K> om te zetten naar <K>{String.raw`\si{dm}^3`}</K>:
                        <K display>{String.raw`
                            \begin{aligned}
                                15{,}0~\orange{\si{m}^3} &= 15{,}0\cdot~\orange{10^3~\si{dm}^3}\\
                            \end{aligned}`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default M3NaarDm3;
