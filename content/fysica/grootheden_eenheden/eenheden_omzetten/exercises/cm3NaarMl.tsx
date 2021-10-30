import React from "react";

import { Exercise } from "components/shortcodes/exercise";
import { ExerciseStepper } from "components/shortcodes/exerciseStepper";
import { MultipleChoice } from "components/shortcodes/multipleChoice";
import { Explanation } from "components/shortcodes/explanation";
import Md from "components/markdown";


const ex1 = String.raw`
We gaan in deze oefening $250~\si{cm}^3$ proberen omzetten naar $\si{ml}$. Dat doen we in drie stappen. Eerst zetten we $\si{cm}^3$ om naar $\si{dm}^3$. Die $\si{dm}^3$ mogen we vervolgens gewoon vervangen door liter om ten slotte de omzetting te doen van liter naar $\si{ml}$.

We beginnen met de omzetting van $\si{cm}^3$ naar $\si{dm}^3$. Hoeveel $\si{dm}^3$ is $1~\si{cm}^3$?
`;

const ex1Choices = String.raw`
$1~\si{cm}^3 = 10^{-3}~\si{dm}^3$
$1~\si{cm}^3 = 10^{-1}~\si{dm}^3$
$1~\si{cm}^3 = 10^{1}~\si{dm}^3$
$1~\si{cm}^3 = 10^{3}~\si{dm}^3$
`.split('\n').slice(1, -1);

const ex1Expl = String.raw`
We zoeken eigenlijk wat in de volgende gelijkheid op de puntjes moet staan:

$$
1~\si{cm}^3 = \ldots~\si{dm}^3
$$

Zoals we al leerden moet daar een breuk komen met in de teller de macht van $10$ die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van $10$ van de eenheid waar we naartoe gaan. We komen van $\si{cm}^3$ en gaan naar $\si{dm}^3$. 

Bij *centi-* hoort $10^{-2}$, maar daar moeten we nog eens een macht $3$ bij zetten omdat het *kubieke* centimeter is. We krijgen dus $\left(10^{-2}\right)^{\!3}$. Voor $\si{dm}^3$ krijgen we zo $\left(10^{-1}\right)^{\!3}$. De gelijkheid wordt dus:

$$
1~\si{cm}^3 = \frac{\left(10^{-2}\right)^{\!3}}{\left(10^{-1}\right)^{\!3}}~\si{dm}^3
$$

Dit kunnen we verder uitrekenen naar:

$$
1~\si{cm}^3 = 10^{-3}~\si{dm}^3
$$
`;


const ex2 = String.raw`
We hebben $\si{cm}^3$ nu omgezet naar $\si{dm}^3$. Die $\si{dm}^3$ mogen we gewoon vervangen door $\si{l}$ (liter) omdat $1~\si{dm}^3 = 1~\si{l}$.  Die $\si{l}$ kunnen we dan weer verder omzetten naar $\si{ml}$. Zo vinden we aan hoeveel milliliter $1~\si{cm}^3$ gelijk is.

Duid het juiste antwoord aan.
`;

const ex2Choices = String.raw`
$1~\si{cm}^3 = 1~\si{ml}$
$1~\si{cm}^3 = 10~\si{ml}$
$1~\si{cm}^3 = 10^{-1}~\si{ml}$
$1~\si{cm}^3 = 10^{-2}~\si{ml}$
`.split('\n').slice(1, -1);

const ex2Expl = String.raw`
In de vorige oefening vonden we al dat

$$
1~\si{cm}^3 = 10^{-3}~\si{dm}^3
$$

Omdat $1~\si{dm}^3 = 1~\si{l}$, mogen we die $\si{dm}^3$ gewoon vervangen door $\si{l}$ (liter):

$$
1~\si{cm}^3 = 10^{-3}~\si{l}
$$

We kunnen nu $10^{-3}~\si{l}$ verder omzetten naar $\si{ml}$. Met behulp van de tabel met voorvoegsels, zou je moeten kunnen vinden dat $1~\si{l} = 10^3~\si{ml}$. Er geldt dus dat:

$$
\begin{aligned}
10^{-3}~\si{l} &= 10^{-3}\cdot \orange{1~\si{l}}\\
&= 10^{-3}\cdot \orange{10^3~\si{ml}}\\
\end{aligned}
$$

Dit kunnen we verder uitrekenen naar :

$$
10^{-3}~\si{l} = 1~\si{ml}
$$

Een omdat $1~\si{cm}^3 = 10^{-3}~\si{l}$, vinden we dus dat:

$$
1~\si{cm}^3 = 1~\si{ml}
$$
`;


const ex3 = String.raw`
We hebben nu gevonden aan hoeveel $\si{ml}$ $1~\si{cm}^3$ gelijk is. Daarmee kunnen we nu $250~\si{cm}^3$ omzetten naar $\si{ml}$.

Duid het juiste antwoord aan.
`;

const ex3Choices = String.raw`
$250~\si{cm}^3 = 250~\si{ml}$
$250~\si{cm}^3 = 2{,}50~\si{ml}$
$250~\si{cm}^3 = 25{,}0~\si{ml}$
$250~\si{cm}^3 = 250\cdot 10~\si{ml}$
`.split('\n').slice(1, -1);

const ex3Expl = String.raw`
We vonden in de vorige vraag al dat:

$$
1~\si{cm}^3 = 1~\si{ml}
$$

We kunnen $250~\si{cm}^3$ dus als volgt omzetten naar $\si{ml}$:

$$
\begin{aligned}
250~\si{cm}^3 &= 250\cdot \orange{1~\si{cm}^3}\\
&= 250\cdot \orange{1~\si{ml}}\\
&= 250~\si{ml}\\
\end{aligned}
$$
`;

const Cm3NaarMl = () => {
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
            <Exercise>
                <Md>{ ex3 }</Md>
                <MultipleChoice choices={ex3Choices.map(c => <Md>{c}</Md>)} solution={0}>
                <Explanation>
                    <Md>{ ex3Expl }</Md>
                </Explanation>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default Cm3NaarMl;