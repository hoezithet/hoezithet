import React from "react";

import { Exercise } from "components/shortcodes/exercise";
import { ExerciseStepper } from "components/shortcodes/exerciseStepper";
import { MultipleChoice } from "components/shortcodes/multipleChoice";
import { Explanation } from "components/shortcodes/explanation";
import Md from "components/markdown";

const ex1 = String.raw`Welke macht van $10$ komt overeen met $\si{h}$ (*hecto-*)?`;

const ex1Choices = String.raw`
$10^{2}$
$10^{-1}$
$10^{1}$
$10^{-2}$
`.split('\n').slice(1, -1);

const ex1Expl = String.raw`
Zoals je in de tabel met voorvoegsels kan zien, komt *hecto-* overeen met $10^2$. Een trucje om dit te onthouden: "**Hecto**r is een oude man van **100** jaar" ($100 = 10^2$).
`;


const ex2 = String.raw`
Welke macht van $10$ komt overeen met $\si{k}$ (*kilo-*)?
`;

const ex2Choices = String.raw`
$10^{3}$
$10^{-3}$
$10^{6}$
$10^{-6}$
`.split('\n').slice(1, -1);

const ex2Expl = String.raw`
Zoals je in de tabel met voorvoegsels kan zien, komt *kilo-* overeen met $10^3$.
`;

const ex3 = String.raw`
De eenheid van druk is de **pascal** met als symbool $\si{Pa}$. De luchtdruk, bijvoorbeeld, wordt vaak in $\si{hPa}$ (hectopascal) uitgedrukt.

**Hoeveel $\si{kPa}$ is $1013~\si{hPa}$?**
`;

const ex3Choices = String.raw`
$1013~\si{hPa} = 101{,}3~\si{kPa}$
$1013~\si{hPa} = 1013\cdot 10^{1}~\si{kPa}$
$1013~\si{hPa} = 1013\cdot 10^{3}~\si{kPa}$
$1013~\si{hPa} = 1{,}013~\si{kPa}$
`.split('\n').slice(1, -1);

const ex3Expl = String.raw`
Om $1013~\si{hPa}$ om te kunnen zetten naar $\si{kPa}$, moeten we eerst weten waaraan $1~\si{hPa}$ gelijk is:

$$
1~\si{hPa} = \ldots \si{kPa}
$$

We leerden in de vorige paragraaf dat op de puntjes een breuk moet komen met in de teller de macht van $10$ die overeenkomt met het voorvoegsel waar we vandaan komen en in de noemer de macht van $10$ die overeenkomt met het voorvoegsel waar we naartoe gaan. We gaan van *hecto-* naar *kilo-*, dus in de teller komt $10^2$ (van *hecto-*) en in de noemer komt $10^3$ (van *kilo-*):

$$
1~\si{hPa} = \frac{10^2}{10^3}~\si{kPa}
$$

Dit kunnen we verder vereenvoudigen naar:

$$
1~\si{hPa} = 10^{-1}~\si{kPa}
$$

En dus:

$$
\begin{aligned}
1013~\si{hPa} &= 1013\cdot \orange{1~\si{hPa}}\\
&= 1013\cdot \orange{10^{-1}~\si{kPa}}\\
&= 101{,}3~\si{kPa}
\end{aligned}
$$
`;

const HPaNaarKPa = () => {
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


export default HPaNaarKPa;