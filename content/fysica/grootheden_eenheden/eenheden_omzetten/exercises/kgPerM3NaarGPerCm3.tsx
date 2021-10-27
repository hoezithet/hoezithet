import React from "react";

import { Exercise } from "components/shortcodes/exercise";
import { ExerciseStepper } from "components/shortcodes/exerciseStepper";
import { MultipleChoice } from "components/shortcodes/multipleChoice";
import { Explanation } from "components/shortcodes/explanation";
import Md from "components/markdown";


const ex1 = String.raw`
In deze oefening gaan we $1~\frac{\si{kg}}{\si{m}^3}$ proberen omzetten naar $\frac{\si{g}}{\si{cm}^3}$. Zoals we net geleerd hebben, splitsen we dat soort omzettingen best op in twee omzettingen: van $\si{kg}$ naar $\si{g}$ en van $\si{m}^3$ naar $\si{cm}^3$.

We beginnen met de omzetting van $\si{kg}$ naar $\si{g}$. Hoeveel $\si{g}$ bedraagt $1~\si{kg}$?
`;

const ex1Choices = String.raw`
$1~\si{kg} = 10^{3}~\si{g}$
$1~\si{kg} = 10^{-3}~\si{g}$
$1~\si{kg} = 10^{0}~\si{g}$
$1~\si{kg} = 10^{-1}~\si{g}$
$1~\si{kg} = 10^{1}~\si{g}$
`.split('\n').slice(1, -1);

const ex1Expl = String.raw`
We zoeken wat er in de volgende gelijkheid op de puntjes moet staan:

$$
1~si{kg} = \ldots~\si{g}
$$

Zoals we al leerden moet daar een breuk komen met in de teller de macht van $10$ die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van $10$ van de eenheid waar we naartoe gaan. We komen van $\si{kg}$ en gaan naar $\si{g}$. 

Bij *kilo-* hoort $10^{3}$. Die komt dus in de teller terecht. Bij $\si{g}$ staat geen vervoegsel, dus daar hoort $10^0$ bij. De gelijkheid wordt dus:

$$
1~si{kg} = \frac{10^3}{10^0}~\si{g}
$$

Dit kunnen we verder uitrekenen naar:

$$
1~si{kg} = 10^3~\si{g}
$$
`;


const ex2 = String.raw`
De tweede omzetting die we moeten doen, gaat van $\si{m}^3$ naar $\si{cm}^3$. Hoeveel $\si{cm}^3$ is $1~\si{m}^3$?
`;

const ex2Choices = String.raw`
$1~\si{m}^3 = 10^{6}~\si{cm}^3$
$1~\si{m}^3 = 10^{-6}~\si{cm}^3$
$1~\si{m}^3 = 10^{-2}~\si{cm}^3$
$1~\si{m}^3 = 10^{2}~\si{cm}^3$
`.split('\n').slice(1, -1);

const ex2Expl = String.raw`
We zoeken wat in de volgende gelijkheid op de puntjes moet staan:

$$
1~si{m}^3 = \ldots~\si{cm}^3
$$

Zoals we al leerden moet daar een breuk komen met in de teller de macht van $10$ die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van $10$ van de eenheid waar we naartoe gaan. We komen van $\si{m}^3$ en gaan naar $\si{cm}^3$. 

Bij $\si{m}^3$ staat geen voorvoegsel, dus daar hoort $10^{0}$ bij. Bij *centi-* hoort de macht $10^{-2}$, maar daar moeten we nog eens een exponent $3$ bij zetten omdat het *kubieke* centimeter is. We krijgen dus $\left(10^{-2}\right)^{\!3}$. De gelijkheid wordt dus:

$$
1~si{m}^3 = \frac{10^{0}}{\left(10^{-2}\right)^{\!3}}~\si{cm}^3
$$

Dit kunnen we verder uitrekenen naar:

$$
1~si{m}^3 = 10^{6}~\si{cm}^3
$$
`;


const ex3 = String.raw`
We hebben nu zowel $\si{kg}$ naar $\si{g}$ als $\si{m}^3$ naar $\si{cm}^3$ omgezet. Met de uitkomsten hiervan kunnen we nu dan ook $\frac{\si{kg}}{\si{m}^3}$ gaan omzetten naar $\frac{\si{g}}{\si{cm}^3}$.

Duid het juiste antwoord aan.
`;

const ex3Choices = String.raw`
$1~\frac{\si{kg}}{\si{m}^3} = 10^{-3}~\frac{\si{g}}{\si{cm}^3}$
$1~\frac{\si{kg}}{\si{m}^3} = 10^{3}~\frac{\si{g}}{\si{cm}^3}$
$1~\frac{\si{kg}}{\si{m}^3} = 10^{5}~\frac{\si{g}}{\si{cm}^3}$
$1~\frac{\si{kg}}{\si{m}^3} = 10~\frac{\si{g}}{\si{cm}^3}$
`.split('\n').slice(1, -1);

const ex3Expl = String.raw`
We vonden in de vorige vraag al dat:

$$
1~si{kg} = 10^3~\si{g}
$$

en dat:

$$
1~\si{m}^3 = 10^{6}~\si{cm}^3
$$

Dat betekent dan dat:

$$
\begin{aligned}
1~\frac{\si{kg}}{\si{m}^3} &= \frac{10^3}{10^6}\frac{\si{g}}{\si{cm}^3}\\
&= 10^{-3}\frac{\si{g}}{\si{cm}^3}\\
\end{aligned}
$$
`;

const KgPerM3NaarGPerCm3 = () => {
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


export default KgPerM3NaarGPerCm3;
