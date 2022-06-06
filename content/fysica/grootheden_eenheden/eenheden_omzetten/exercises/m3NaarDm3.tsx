import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";


const ex1 = String.raw`
Bij de eenheid $\si{m}^3$ staat **geen voorvoegsel** en een **exponent $3$**. Welke macht van $10$ hoort hier dan bij?
`;

const ex1Choices = String.raw`
$\left(10^{0}\right)^3$
$\left(10^{-1}\right)^3$
$\left(10^{1}\right)^3$
$\left(10^{2}\right)^3$
`.split('\n').slice(1, -1);

const ex1Expl = String.raw`
Zoals je in de tabel met voorvoegsels kan zien, komt *geen voorvoegsel* overeen met $10^{0}$. Er staat een exponent $3$ bij onze eenheid, die moeten we ook bij onze macht van $10$ zetten.
`;


const ex2 = String.raw`
Bij de eenheid $\si{dm}^3$ staat **het voorvoegsel $\si{d}$ (*deci-*)** en een **exponent $3$**. Welke macht van $10$ hoort hier dan bij?
`;

const ex2Choices = String.raw`
$\left(10^{-1}\right)^3$
$\left(10^{0}\right)^3$
$\left(10^{1}\right)^3$
$\left(10^{2}\right)^3$
`.split('\n').slice(1, -1);

const ex2Expl = String.raw`
Zoals je in de tabel met voorvoegsels kan zien, komt *deci-* overeen met $10^{-1}$. Er staat een exponent $3$ bij onze eenheid, die moeten we ook bij onze macht van $10$ zetten.
`;


const ex3 = String.raw`
Zet $15{,}0~\si{m}^3$ om naar $\si{dm}^3$.
`;

const ex3Choices = String.raw`
$15{,}0~\si{m}^3 = 15{,}0\cdot 10^{3}~\si{dm}^3$
$15{,}0~\si{m}^3 = 15{,}0\cdot 10^{-3}~\si{dm}^3$
$15{,}0~\si{m}^3 = 150~\si{dm}^3$
$15{,}0~\si{m}^3 = 1{,}50~\si{dm}^3$
`.split('\n').slice(1, -1);

const ex3Expl = String.raw`
Om $15{,}0~\si{m}^3$ om te kunnen zetten naar $\si{dm}^3$, moeten we eerst weten waaraan $1~\si{m}^3$ gelijk is:

$$
1~\si{m}^3 = \ldots~\si{dm}^3
$$

We leerden in de vorige paragraaf dat op de puntjes een breuk moet komen met in de teller de macht van $10$ die overeenkomt met het voorvoegsel waar we vandaan komen en in de noemer de macht van $10$ die overeenkomt met het voorvoegsel waar we naartoe gaan. Bij $\si{m}^3$ hoort $\left(10^0\right)^3 = 10^0$ en bij $\si{dm}^3$ hoort $\left(10^{-1}\right)^3 = 10^{-3}$. In de teller komt dus $10^0$ en in de noemer komt $10^{-3}$:

$$
1~\si{m}^3 = \frac{10^0}{10^{-3}}~\si{dm}^3
$$

We kunnen deze breuk verder vereenvoudigen:

$$
\begin{aligned}
1~\si{m}^3 &= \frac{10^0}{10^{-3}}~\si{dm}^3\\
&= 10^{0 - (-3)}~\si{dm}^3\\
&= 10^3~\si{dm}^3\\
\end{aligned}
$$

We vinden dus dat

$$
1~\si{m}^3 = 10^3~\si{dm}^3
$$

Dit kunnen we gebruiken om $15{,}0~\si{m}^3$ om te zetten naar $\si{dm}^3$:

$$
\begin{aligned}
15{,}0~\orange{\si{m}^3} &= 15{,}0\cdot~\orange{10^3~\si{dm}^3}\\
\end{aligned}
$$
`;

const M3NaarDm3 = () => {
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
            <Exercise>
                <Md>{ ex3 }</Md>
                <MultipleChoice choices={ex3Choices} solution={0}>
                    { ex3Expl }
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default M3NaarDm3;
