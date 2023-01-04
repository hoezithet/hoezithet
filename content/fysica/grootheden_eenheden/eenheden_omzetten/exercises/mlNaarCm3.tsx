import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import Md from "components/markdown";
import { Katex as K } from "components/katex";


const ex1 = String.raw`
We gaan in deze oefening $250~\si{ml}$ proberen omzetten naar $\si{cm}^3$. Dat doen we in drie stappen. Eerst zetten we $\si{ml}$ om naar $\si{l}$. Die $\si{l}$ mogen we vervolgens gewoon vervangen door kubieke decimeter om ten slotte de omzetting te doen van kubieke decimeter naar $\si{cm}^3$.

We beginnen met de omzetting van $\si{ml}$ naar $\si{l}$. Hoeveel $\si{l}$ is $1~\si{ml}$?
`;

const ex1Choices = [
    <K>{String.raw`1~\si{ml} = 10^{-3}~\si{l}`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-1}~\si{l}`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{1}~\si{l} `}</K>,
    <K>{String.raw`1~\si{ml} = 10^{3}~\si{l} `}</K>,
];

const ex1Expl = String.raw`
We zoeken eigenlijk wat in de volgende gelijkheid op de puntjes moet staan:

$$
1~\si{ml} = \ldots~\si{l}
$$

Zoals we al leerden moet daar een breuk komen met in de teller de macht van $10$ die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van $10$ van de eenheid waar we naartoe gaan.

We komen van $\si{ml}$. Bij *milli-* hoort $10^{-3}$. We gaan naar $\si{l}$ en daar staat geen voorvoegsel bij, wat overeenkomt met $10^0$. De gelijkheid wordt dus:

$$
1~\si{ml} = \frac{10^{-3}}{10^{0}}~\si{l}
$$

Dit kunnen we vereenvoudigen tot:

$$
1~\si{ml} = 10^{-3}~\si{l}
$$
`;


const ex2 = String.raw`
We hebben $\si{ml}$ nu omgezet naar $\si{l}$. Die $\si{l}$ mogen we gewoon vervangen door $\si{dm}^3$ (kubieke decimeter) omdat $1~\si{l} = 1~\si{dm}^3$.  Die $\si{dm}^3$ kunnen we dan weer verder omzetten naar $\si{cm}^3$. Zo vinden we aan hoeveel kubieke centimeter $1~\si{ml}$ gelijk is.

Reken dit zelf uit en duid vervolgens het juiste antwoord aan.
`;

const ex2Choices = [
    <K>{String.raw`1~\si{ml} = 1~\si{cm}^3      `}</K>,
    <K>{String.raw`1~\si{ml} = 10~\si{cm}^3     `}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-1}~\si{cm}^3`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-2}~\si{cm}^3`}</K>,
];

const ex2Expl = String.raw`
In de vorige oefening vonden we al dat

$$
1~\si{ml} = 10^{-3}~\si{l}
$$

Omdat $1~\si{l} = 1~\si{dm}^3$, mogen we die $\si{l}$ gewoon vervangen door $\si{dm}^3$ (kubieke decimeter):

$$
\begin{aligned}
1~\si{ml} &= 10^{-3}~\orange{\si{l}}\\
&= 10^{-3}~\orange{\si{dm}^3}
\end{aligned}
$$

We kunnen nu $10^{-3}~\si{dm}^3$ verder omzetten naar $\si{cm}^3$. Met behulp van de tabel met voorvoegsels, zou je moeten kunnen vinden dat $1~\si{dm}^3 = 10^3~\si{cm}^3$. Er geldt dus dat:

$$
\begin{aligned}
1~\si{ml} &= 10^{-3}~\orange{\si{l}}\\
&= 10^{-3}~\orange{\si{dm}^3}\\
&= 10^{-3}\cdot \orange{10^3~\si{cm}^3}\\
\end{aligned}
$$

Dit kunnen we verder uitrekenen :

$$
\begin{aligned}
\hphantom{1~\si{ml}} &= 10^{-3 + 3}~\si{cm}^3\\
&= 10^{0}~\si{cm}^3\\
&= 1~\si{cm}^3\\
\end{aligned}
$$

We vinden dus dat:

$$
1~\si{ml} = 1~\si{cm}^3
$$
`;


const ex3 = String.raw`
We hebben nu gevonden aan hoeveel $\si{cm}^3$ $1~\si{ml}$ gelijk is. Daarmee kunnen we nu $250~\si{ml}$ omzetten naar $\si{cm}^3$.

Duid het juiste antwoord aan.
`;

const ex3Choices = [
    <K>{String.raw`250~\si{ml} = 250~\si{cm}^3        `}</K>,
    <K>{String.raw`250~\si{ml} = 2{,}50~\si{cm}^3     `}</K>,
    <K>{String.raw`250~\si{ml} = 25{,}0~\si{cm}^3     `}</K>,
    <K>{String.raw`250~\si{ml} = 250\cdot 10~\si{cm}^3`}</K>,
];

const ex3Expl = String.raw`
We vonden in de vorige vraag al dat:

$$
1~\si{ml} = 1~\si{cm}^3
$$

We kunnen $250~\si{ml}$ dus als volgt omzetten naar $\si{cm}^3$:

$$
\begin{aligned}
250~\orange{\si{ml}} &= 250\cdot \orange{1~\si{cm}^3}\\
&= 250~\si{cm}^3\\
\end{aligned}
$$
`;

const MlNaarCm3 = () => {
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


export default MlNaarCm3;
