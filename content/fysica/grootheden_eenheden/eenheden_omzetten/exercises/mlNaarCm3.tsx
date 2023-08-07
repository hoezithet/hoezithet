import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from "components/katex";


const ex1Choices = [
    <K>{String.raw`1~\si{ml} = 10^{-3}~\si{l}`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-1}~\si{l}`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{1}~\si{l} `}</K>,
    <K>{String.raw`1~\si{ml} = 10^{3}~\si{l} `}</K>,
];

const ex2Choices = [
    <K>{String.raw`1~\si{ml} = 1~\si{cm}^3      `}</K>,
    <K>{String.raw`1~\si{ml} = 10~\si{cm}^3     `}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-1}~\si{cm}^3`}</K>,
    <K>{String.raw`1~\si{ml} = 10^{-2}~\si{cm}^3`}</K>,
];

const ex3Choices = [
    <K>{String.raw`250~\si{ml} = 250~\si{cm}^3        `}</K>,
    <K>{String.raw`250~\si{ml} = 2{,}50~\si{cm}^3     `}</K>,
    <K>{String.raw`250~\si{ml} = 25{,}0~\si{cm}^3     `}</K>,
    <K>{String.raw`250~\si{ml} = 250\cdot 10~\si{cm}^3`}</K>,
];

const MlNaarCm3 = () => {
    return (
        <ExerciseStepper>
            <Exercise>
            We gaan in deze oefening <K>{String.raw`250~\si{ml}`}</K> proberen omzetten naar <K>{String.raw`\si{cm}^3`}</K>. Dat doen we in drie stappen. Eerst zetten we <K>{String.raw`\si{ml}`}</K> om naar <K>{String.raw`\si{l}`}</K>. Die <K>{String.raw`\si{l}`}</K> mogen we vervolgens gewoon vervangen door kubieke decimeter om ten slotte de omzetting te doen van kubieke decimeter naar <K>{String.raw`\si{cm}^3`}</K>.<br/>
            We beginnen met de omzetting van <K>{String.raw`\si{ml}`}</K> naar <K>{String.raw`\si{l}`}</K>. Hoeveel <K>{String.raw`\si{l}`}</K> is <K>{String.raw`1~\si{ml}`}</K>?
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        We zoeken eigenlijk wat in de volgende gelijkheid op de puntjes moet staan:
                        <K display>{String.raw`1~\si{ml} = \ldots~\si{l}`}</K>
                            Zoals we al leerden moet daar een breuk komen met in de teller de macht van <K>{String.raw`10`}</K> die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van <K>{String.raw`10`}</K> van de eenheid waar we naartoe gaan.<br/>
                            We komen van <K>{String.raw`\si{ml}`}</K>. Bij <em>milli-</em> hoort <K>{String.raw`10^{-3}`}</K>. We gaan naar <K>{String.raw`\si{l}`}</K> en daar staat geen voorvoegsel bij, wat overeenkomt met <K>{String.raw`10^0`}</K>. De gelijkheid wordt dus:
                            <K display>{String.raw`1~\si{ml} = \frac{10^{-3}}{10^{0}}~\si{l}`}</K>
                            Dit kunnen we vereenvoudigen tot:
                            <K display>{String.raw`1~\si{ml} = 10^{-3}~\si{l}`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                We hebben <K>{String.raw`\si{ml}`}</K> nu omgezet naar <K>{String.raw`\si{l}`}</K>. Die <K>{String.raw`\si{l}`}</K> mogen we gewoon vervangen door <K>{String.raw`\si{dm}^3`}</K> (kubieke decimeter) omdat <K>{String.raw`1~\si{l} = 1~\si{dm}^3`}</K>.  Die <K>{String.raw`\si{dm}^3`}</K> kunnen we dan weer verder omzetten naar <K>{String.raw`\si{cm}^3`}</K>. Zo vinden we aan hoeveel kubieke centimeter <K>{String.raw`1~\si{ml}`}</K> gelijk is.<br/>
                Reken dit zelf uit en duid vervolgens het juiste antwoord aan.
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                        In de vorige oefening vonden we al dat
                        <K display>{String.raw`1~\si{ml} = 10^{-3}~\si{l}`}</K>
        Omdat <K>{String.raw`1~\si{l} = 1~\si{dm}^3`}</K>, mogen we die <K>{String.raw`\si{l}`}</K> gewoon vervangen door <K>{String.raw`\si{dm}^3`}</K> (kubieke decimeter):
        <K display>{String.raw`
\begin{aligned}
1~\si{ml} &= 10^{-3}~\orange{\si{l}}\\
&= 10^{-3}~\orange{\si{dm}^3}
\end{aligned}
`}</K>
        We kunnen nu <K>{String.raw`10^{-3}~\si{dm}^3`}</K> verder omzetten naar <K>{String.raw`\si{cm}^3`}</K>. Met behulp van de tabel met voorvoegsels, zou je moeten kunnen vinden dat <K>{String.raw`1~\si{dm}^3 = 10^3~\si{cm}^3`}</K>. Er geldt dus dat:
        <K display>{String.raw`
\begin{aligned}
1~\si{ml} &= 10^{-3}~\orange{\si{l}}\\
&= 10^{-3}~\orange{\si{dm}^3}\\
&= 10^{-3}\cdot \orange{10^3~\si{cm}^3}\\
\end{aligned}
`}</K>
Dit kunnen we verder uitrekenen:
<K display>{String.raw`
\begin{aligned}
\hphantom{1~\si{ml}} &= 10^{-3 + 3}~\si{cm}^3\\
&= 10^{0}~\si{cm}^3\\
&= 1~\si{cm}^3\\
\end{aligned}
`}</K>
We vinden dus dat:
<K display>{String.raw`1~\si{ml} = 1~\si{cm}^3`}</K>
</div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                We hebben nu gevonden aan hoeveel <K>{String.raw`\si{cm}^3`}</K> <K>{String.raw`1~\si{ml}`}</K> gelijk is. Daarmee kunnen we nu <K>{String.raw`250~\si{ml}`}</K> omzetten naar <K>{String.raw`\si{cm}^3`}</K>.<br/>
                Duid het juiste antwoord aan.
                <MultipleChoice choices={ex3Choices} solution={0}>
                    <div>
                    We vonden in de vorige vraag al dat:
                    <K display>{String.raw`1~\si{ml} = 1~\si{cm}^3`}</K>
                    We kunnen <K>{String.raw`250~\si{ml}`}</K> dus als volgt omzetten naar <K>{String.raw`\si{cm}^3`}</K>:
                    <K display>{String.raw`\begin{aligned}
250~\orange{\si{ml}} &= 250\cdot \orange{1~\si{cm}^3}\\
&= 250~\si{cm}^3\\
\end{aligned}`}</K>
</div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default MlNaarCm3;
