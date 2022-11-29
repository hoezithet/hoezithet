import React from "react";

import MultipleChoiceStepper from 'components/exercises/multipleChoiceStepper';
import { getVoorschrift1GStr } from '../tekenschema/drawings';
import { Katex as KX } from 'components/katex';
import _random from "lodash/random";


export const WatIsMEnQ = () => {
    let ms = Array.from({length: 5}, () => _random(-10, 10));
    let qs = ms.map(() => _random(-10, 10));
    const rand_i = _random(ms.length - 1);
    ms[rand_i] = 0;
    qs[(rand_i + Math.round(ms.length/2)) % qs.length] = 0;

    const texts = [];
    const choices = [];
    const solutions = [];
    const explanations = [];

    ms.forEach((m, i) => {
        const q = qs[i];
        const voorschr = <KX>{getVoorschrift1GStr(m, q, true)}</KX>;
        texts.push(<>Waaraan zijn <KX>m</KX> en <KX>q</KX> gelijk in {voorschr}?</>);
        const exChoices = [
            [m, q],
            [q, m],
        ];
        if (m !== 0) {
            exChoices.push(
              [-m, q]
            );
        }
        if (q !== 0) {
            exChoices.push(
              [m, -q]
            );
        }
        if (m !== 0 && q !== 0) {
            exChoices.push(
              [-m, -q]
            );
        }
        choices.push(
            exChoices.map(([m, q]) =>
                <KX display>{String.raw`
                  \begin{aligned}
                    m &= ${m}\\
                    q &= ${q}\\
                  \end{aligned}
                `}</KX>
            )
        );
        explanations.push(
            <div>Je kan {voorschr} herschrijven als <KX>{`y = ${m}\\cdot x + ${q < 0 ? "(" : ""}${q}${q < 0 ? ")" : ""}`}</KX>. Zo zie je dat <KX>{`m = ${m}`}</KX> en <KX>{`q = ${q}`}</KX>.</div>
        );
        solutions.push(0);
    });

    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions} explanations={explanations} Wrapper={props => <div {...props}/>}/>
    );
};


export const Herken1GFx = () => {
    const texts = [
        "f(x) = -5 + x",
        "f(x) = 3",
        "f(x) = (2\\cdot x + 1)^{-1}",
        "f(x) = \\frac{x + 2}{3}",
    ].map(t => <>Is <KX>{t}</KX> een eerstegraadsfunctie in <KX>x</KX>?</>);
    const choices = texts.map(() => ["Ja", "Neen"]);
    const solutions = [
        0, 1, 1, 0
    ];
    const explanations = [
    <React.Fragment>
        Je kan <KX>{"f(x) = -5 + x"}</KX> herschrijven als <KX>{"f(x) = x + (- 5)"}</KX>. Het is dus een eerstegraadsfunctie met <KX>{"m = 1"}</KX> en <KX>{"q = -5"}</KX>.
    </React.Fragment>,
    <React.Fragment>
        Je kan <KX>{"f(x) = 3"}</KX> herschrijven als <KX>{String.raw`f(x) = 0\cdot x + 3`}</KX>, zodat <KX>{"m = 0"}</KX> en <KX>{"q = 3"}</KX>. De definitie van een eerstegraadsfunctie zegt echter dat in een eerstegraadsfunctie <KX>{"m"}</KX> niet gelijk mag zijn aan nul, omdat dan <KX>{"x"}</KX> wegvalt en de hoogste macht van <KX>{"x"}</KX> niet langer gelijk is aan <KX>{"1"}</KX>. Het is dus geen eerstegraadsfunctie (wel een <em>nuldegraadsfunctie</em>).
    </React.Fragment>,
    <React.Fragment>
        <KX>{String.raw`f(x) = (2\cdot x + 1)^{-1}`}</KX> is hetzelfde als <KX>{String.raw`f(x) = \frac{1}{2\cdot x + 1}`}</KX>. Bij een eerstegraadsfunctie mag <KX>{"x"}</KX> niet in de noemer staan. Dit is dus geen eerstegraadsfunctie.
    </React.Fragment>,
    <React.Fragment>
        Je kan <KX>{String.raw`f(x) = \frac{x + 2}{3}`}</KX> herschrijven als <KX>{String.raw`f(x) = \frac{1}{3}\cdot x + \frac{2}{3}`}</KX>. Het is dus een eerstegraadsfunctie met <KX>{String.raw`m = \frac{1}{3}`}</KX> en <KX>{String.raw`q = \frac{2}{3}`}</KX>.
    </React.Fragment>
    ];

    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions} explanations={explanations} Wrapper={props => <div {...props}/>}/>
    );
}
