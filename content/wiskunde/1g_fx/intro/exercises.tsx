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