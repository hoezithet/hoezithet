import React from "react";

import { Exercise } from "components/exercises/exercise";
import { ExerciseStepper } from "components/exercises/exerciseStepper";
import { MultipleChoice } from "components/exercises/multipleChoice";
import { Katex as K } from 'components/katex';


const ex1Choices = [
    <K>{String.raw`1~\si{kg} = 10^{3}~\si{g} `}</K>,
    <K>{String.raw`1~\si{kg} = 10^{-3}~\si{g}`}</K>,
    <K>{String.raw`1~\si{kg} = 10^{0}~\si{g} `}</K>,
    <K>{String.raw`1~\si{kg} = 10^{-1}~\si{g}`}</K>,
    <K>{String.raw`1~\si{kg} = 10^{1}~\si{g} `}</K>,
];

const ex2Choices = [
    <K>{String.raw`1~\si{m}^3 = 10^{6}~\si{cm}^3 `}</K>,
    <K>{String.raw`1~\si{m}^3 = 10^{-6}~\si{cm}^3`}</K>,
    <K>{String.raw`1~\si{m}^3 = 10^{-2}~\si{cm}^3`}</K>,
    <K>{String.raw`1~\si{m}^3 = 10^{2}~\si{cm}^3 `}</K>,
];

const ex3Choices = [
    <K>{String.raw`1~\frac{\si{kg}}{\si{m}^3} = 10^{-3}~\frac{\si{g}}{\si{cm}^3}`}</K>,
    <K>{String.raw`1~\frac{\si{kg}}{\si{m}^3} = 10^{3}~\frac{\si{g}}{\si{cm}^3} `}</K>,
    <K>{String.raw`1~\frac{\si{kg}}{\si{m}^3} = 10^{5}~\frac{\si{g}}{\si{cm}^3} `}</K>,
    <K>{String.raw`1~\frac{\si{kg}}{\si{m}^3} = 10~\frac{\si{g}}{\si{cm}^3}     `}</K>,
];

const ex3Expl = String.raw`
`;

const KgPerM3NaarGPerCm3 = () => {
    return (
        <ExerciseStepper>
            <Exercise>
                In deze oefening gaan we <K>{String.raw`1~\frac{\si{kg}}{\si{m}^3}`}</K> proberen omzetten naar <K>{String.raw`\frac{\si{g}}{\si{cm}^3}`}</K>. Zoals we net geleerd hebben, splitsen we dat soort omzettingen best op in twee omzettingen: van <K>{String.raw`\si{kg}`}</K> naar <K>{String.raw`\si{g}`}</K> en van <K>{String.raw`\si{m}^3`}</K> naar <K>{String.raw`\si{cm}^3`}</K>.<br/>
        We beginnen met de omzetting van <K>{String.raw`\si{kg}`}</K> naar <K>{String.raw`\si{g}`}</K>. Hoeveel <K>{String.raw`\si{g}`}</K> bedraagt <K>{String.raw`1~\si{kg}`}</K>?
                <MultipleChoice choices={ex1Choices} solution={0}>
                    <div>
                        We zoeken wat er in de volgende gelijkheid op de puntjes moet staan:
                        <K display>{String.raw`1~\si{kg} = \ldots~\si{g}`}</K>
                        Zoals we al leerden moet daar een breuk komen met in de teller de macht van <K>{String.raw`10`}</K> die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van <K>{String.raw`10`}</K> van de eenheid waar we naartoe gaan. We komen van <K>{String.raw`\si{kg}`}</K> en gaan naar <K>{String.raw`\si{g}`}</K>.<br/>
                        Bij <em>kilo-</em> hoort <K>{String.raw`10^{3}`}</K>. Die komt dus in de teller terecht. Bij <K>{String.raw`\si{g}`}</K> staat geen vervoegsel, dus daar hoort <K>{String.raw`10^0`}</K> bij. De gelijkheid wordt dus:
                        <K display>{String.raw`1~\si{kg} = \frac{10^3}{10^0}~\si{g}`}</K>
Dit kunnen we verder uitrekenen naar:
<K display>{String.raw`1~\si{kg} = 10^3~\si{g}`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                De tweede omzetting die we moeten doen, gaat van <K>{String.raw`\si{m}^3`}</K> naar <K>{String.raw`\si{cm}^3`}</K>. Hoeveel <K>{String.raw`\si{cm}^3`}</K> is <K>{String.raw`1~\si{m}^3`}</K>?
                <MultipleChoice choices={ex2Choices} solution={0}>
                    <div>
                    We zoeken wat in de volgende gelijkheid op de puntjes moet staan:
                    <K display>{String.raw`1~\si{m}^3 = \ldots~\si{cm}^3`}</K>
                    Zoals we al leerden moet daar een breuk komen met in de teller de macht van <K>{String.raw`10`}</K> die hoort bij de eenheid waar we vandaan komen en in de noemer de macht van <K>{String.raw`10`}</K> van de eenheid waar we naartoe gaan. We komen van <K>{String.raw`\si{m}^3`}</K> en gaan naar <K>{String.raw`\si{cm}^3`}</K>.<br/>
                    Bij <K>{String.raw`\si{m}^3`}</K> staat geen voorvoegsel, dus daar hoort <K>{String.raw`10^{0}`}</K> bij. Bij <em>centi-</em> hoort de macht <K>{String.raw`10^{-2}`}</K>, maar daar moeten we nog eens een exponent <K>{String.raw`3`}</K> bij zetten omdat het <em>kubieke</em> centimeter is. We krijgen dus <K>{String.raw`\left(10^{-2}\right)^{\!3}`}</K>. De gelijkheid wordt dus:
                    <K display>{String.raw`1~\si{m}^3 = \frac{10^{0}}{\left(10^{-2}\right)^{\!3}}~\si{cm}^3`}</K>
                    Dit kunnen we verder uitrekenen naar:
<K display>{String.raw`1~\si{m}^3 = 10^{6}~\si{cm}^3`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
            <Exercise>
                We hebben nu zowel <K>{String.raw`\si{kg}`}</K> naar <K>{String.raw`\si{g}`}</K> als <K>{String.raw`\si{m}^3`}</K> naar <K>{String.raw`\si{cm}^3`}</K> omgezet. Met de uitkomsten hiervan kunnen we nu dan ook <K>{String.raw`\frac{\si{kg}}{\si{m}^3}`}</K> gaan omzetten naar <K>{String.raw`\frac{\si{g}}{\si{cm}^3}`}</K>.<br/>
                Duid het juiste antwoord aan.
                <MultipleChoice choices={ex3Choices} solution={0}>
                    <div>
                        We vonden in de vorige vraag al dat:
                        <K display>{String.raw`1~\si{kg} = 10^3~\si{g}`}</K>
                        en dat:
                        <K display>{String.raw`1~\si{m}^3 = 10^{6}~\si{cm}^3`}</K>
                        Dat betekent dan dat:
                        <K display>{String.raw`\begin{aligned}
                            1~\frac{\si{kg}}{\si{m}^3} &= \frac{10^3}{10^6}\frac{\si{g}}{\si{cm}^3}\\
                            &= 10^{-3}\frac{\si{g}}{\si{cm}^3}\\
                        \end{aligned}`}</K>
                    </div>
                </MultipleChoice>
            </Exercise>
        </ExerciseStepper>
    );
};


export default KgPerM3NaarGPerCm3;
