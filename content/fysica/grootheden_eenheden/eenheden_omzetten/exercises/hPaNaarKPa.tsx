import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from 'components/katex';

const ex1Choices = [
    <K>{String.raw`10^{2}`}</K>,
    <K>{String.raw`10^{-1}`}</K>,
    <K>{String.raw`10^{1}`}</K>,
    <K>{String.raw`10^{-2}`}</K>,
];

const ex2Choices = [
    <K>{String.raw`10^{3}`}</K>,
    <K>{String.raw`10^{-3}`}</K>,
    <K>{String.raw`10^{6}`}</K>,
    <K>{String.raw`10^{-6}`}</K>,
]

const ex3Choices = [
    <K>{String.raw`1013~\si{hPa} = 101{,}3~\si{kPa}         `}</K>,
    <K>{String.raw`1013~\si{hPa} = 1013\cdot 10^{1}~\si{kPa}`}</K>,
    <K>{String.raw`1013~\si{hPa} = 1013\cdot 10^{3}~\si{kPa}`}</K>,
    <K>{String.raw`1013~\si{hPa} = 1{,}013~\si{kPa}         `}</K>,
]

const HPaNaarKPa = () => {
    return (
        <ExerciseStepper>
            <Exercise>
                Welke macht van <K>10</K> komt overeen met <K>{`\\si{h}`}</K> (<em>hecto-</em>)?
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        Zoals je in de tabel met voorvoegsels kan zien, komt <em>hecto-</em> overeen met <K>10^2</K>. Een trucje om dit te onthouden: <b>Hecto</b>r is een oude man van <b>100</b> jaar (<K>100 = 10^2</K>).
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                Welke macht van <K>10</K> komt overeen met <K>{'\\si{k}'}</K> (<em>kilo-</em>)?
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                        Zoals je in de tabel met voorvoegsels kan zien, komt <em>kilo-</em> overeen met <K>10^3</K>.
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
            De eenheid van druk is de <b>pascal</b> met als symbool <K>{'\\si{Pa}'}</K>. De luchtdruk, bijvoorbeeld, wordt vaak in <K>{'\\si{hPa}'}</K> (hectopascal) uitgedrukt.<br/>
            <b>Hoeveel <K>{'\\si{kPa}'}</K> is <K>{'1013~\\si{hPa}'}</K>?</b>
                <MultipleChoice choices={ex3Choices} solution={0}>
                    <div>
                        Om <K>{'1013~\\si{hPa}'}</K> om te kunnen zetten naar <K>{'\\si{kPa}'}</K>, moeten we eerst weten waaraan <K>{'1~\\si{hPa}'}</K> gelijk is:
                        <K display>{'1~\\si{hPa} = \\ldots \\si{kPa}'}</K>
                        We leerden in de vorige paragraaf dat op de puntjes een breuk moet komen met in de teller de macht van <K>{'10'}</K> die overeenkomt met het voorvoegsel waar we vandaan komen en in de noemer de macht van <K>{'10'}</K> die overeenkomt met het voorvoegsel waar we naartoe gaan. We gaan van <em>hecto-</em> naar <em>kilo-</em>, dus in de teller komt <K>{'10^2'}</K> (van <em>hecto-</em>) en in de noemer komt <K>{'10^3'}</K> (van <em>kilo-</em>):
                        <K display>{'1~\\si{hPa} = \\frac{10^2}{10^3}~\\si{kPa}'}</K>
                        Dit kunnen we verder vereenvoudigen naar:
                        <K display>{'1~\\si{hPa} = 10^{-1}~\\si{kPa}'}</K>
                        En dus:
                        <K display>{String.raw`
                        \begin{aligned}
                            1013~\orange{\si{hPa}} &= 1013\cdot \orange{10^{-1}~\si{kPa}}\\
                            &= 101{,}3~\si{kPa}
                        \end{aligned}`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default HPaNaarKPa;
