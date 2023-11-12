import React from "react";
import _random from 'lodash/random';
import _range from 'lodash/range';
import { shuffle } from 'utils/array';

import MultipleChoiceStepper from 'components/exercises/multipleChoiceStepper';
import FillStepper from 'components/exercises/fillStepper';
import { Katex as K } from 'components/katex';


const getEx1 = (i) => {
    const text = String.raw`Waar zijn de **beduidende cijfers** correct aangeduid?`;

    const numZeros = _random(1, 3);
    const numBcs = _random(1, 4);

    const zeros = "0".repeat(numZeros);
    const extras = Array.from({length: numBcs - 1}, () => _random(0, 9)).join("");
    const bcs = `${(i % 10) + 1}${extras}`;
    const sign = _random(0, 1) === 1 ? '-' : '';
    const suffix = String.raw`~\si{kN}`;
    const plainChoice = String.raw`$${sign}0{,}${zeros}${bcs}${suffix}$`;

    const correctStr = String.raw`${sign}0{,}${zeros}\underline{\orange{${bcs}}}${suffix}`;
    const choices = [
        <K>{String.raw`${correctStr}`}</K>,
        <K>{String.raw`${sign}0{,}\underline{\orange{${zeros}${bcs}}}${suffix}`}</K>,
        <K>{String.raw`${sign}\underline{\orange{0{,}${zeros}${bcs}}}${suffix}`}</K>,
        <K>{String.raw`${sign}0{,}\underline{\orange{${zeros}}}${bcs}${suffix}`}</K>,
    ]

    const explanation = bcsToExpl(bcs, correctStr);

    return [text, choices, explanation, plainChoice, numBcs];
}

const bcsToExpl = (bcs, bcsInTeX) => {
    const bcArr = bcs.split('').map(bc => `$${bc}$`);
    const numBcs = bcArr.length;
    let bcText = '';
    if (numBcs > 1) {
        bcText = bcArr.slice(0, -1).join(', ');
        bcText += ` en ${bcArr.slice(-1)[0]}`;
    } else if (numBcs === 1) {
        bcText = bcArr[0];
    }

    let explanation = String.raw`De beduidende cijfers beginnen vanaf het eerste cijfer dat *niet* gelijk is aan nul. ${numBcs === 1 ? `Enkel ${bcText} is daarom een beduidend cijfer.` : `De beduidende cijfers zijn daarom ${bcText}.`} `;
    explanation += String.raw`Aangeduid in de opgave: $${bcsInTeX}$. `;
    explanation += numBcs === 1 ? "Er is dus **1** beduidend cijfer." : `Er zijn dus **${numBcs}** beduidende cijfers.`;

    return explanation;
};

const getExExercises = (getEx, amount) => {
    const texts = [];
    const choices = [];
    const explanations = [];
    
    shuffle(Array(amount).fill(0).map((_, idx) => idx)).forEach((idx) => {
        const [ex1Text, ex1Choices, ex1Expl] = getEx(idx);
        texts.push(ex1Text);
        choices.push(ex1Choices);
       	explanations.push(ex1Expl);
        });
    return [texts, choices, explanations]
}

const [ex1Texts,  ex1Choices, ex1Explanations] = getExExercises(getEx1, 5);


export const DuidBCAan = () => {
    return (
        <MultipleChoiceStepper texts={ex1Texts} choices={ex1Choices} explanations={ex1Explanations}/>
    );
};


const getEx2 = (i) => {
    const text = String.raw`Waar zijn de **beduidende cijfers** correct aangeduid?`;

    const numNonDecimals = _random(1, 3);
    const numNonZeroDecimals = _random(1, 2);
    const numZeros = _random(2, 5);

    const sign = _random(0, 1) === 1 ? '-' : '';
    const exp = _random(2, 9) * (_random(0, 1) === 1 ? 1 : -1);
    const zeroDecimals = "0".repeat(numZeros);
    let nonDecimals = Array.from({length: numNonDecimals - 1}, () => _random(0, 9)).join("");
    nonDecimals = `${(i % 10) + 1}${nonDecimals}`;
    let nonZeroDecimals = Array.from({length: numNonZeroDecimals - 1}, () => _random(0, 9)).join("");
    nonZeroDecimals += _random(1, 9);
    const powTen = String.raw`\cdot 10^{${exp}}`;
    const suffix = String.raw`~\si{m/s}`;
    const plainChoice = String.raw`$${sign}${nonDecimals}{,}${zeroDecimals}${nonZeroDecimals}${powTen}${suffix}$`;

    const bcs = `${nonDecimals}${zeroDecimals}${nonZeroDecimals}`;
    const numBc = numNonDecimals + numZeros + numNonZeroDecimals;
    const correctStr = String.raw`${sign}\underline{\orange{${nonDecimals}{,}${zeroDecimals}${nonZeroDecimals}}}${powTen}${suffix}`;
    const choices = [
        <K>{String.raw`${correctStr}`}</K>,
        <K>{String.raw`${sign}${nonDecimals}{,}${zeroDecimals}\underline{\orange{${nonZeroDecimals}}}${powTen}${suffix}`}</K>,
        <K>{String.raw`${sign}\underline{\orange{${nonDecimals}{,}${zeroDecimals}${nonZeroDecimals}${powTen}}}${suffix}`}</K>,
        <K>{String.raw`${sign}${nonDecimals}{,}\underline{\orange{${zeroDecimals}}}${nonZeroDecimals}${powTen}${suffix}`}</K>,
    ];

    const explanation = bcsToExpl(bcs, correctStr);
    return [text, choices, explanation, plainChoice, numBc];
}

const [ex2Texts,  ex2Choices, ex2Explanations] = getExExercises(getEx2, 5);

export const DuidBCAan2 = () => {
    return (
        <MultipleChoiceStepper texts={ex2Texts} choices={ex2Choices} explanations={ex2Explanations}/>
    );
};


const makeGetNumberBCEx = (getEx) => (i) => {
    const [_texts, _choices, _expl, plainChoice, numBc] = getEx(i);
    const text = `**Hoeveel beduidende cijfers** zijn er in ${plainChoice}?`;
    return [text, numBc, _expl];
}

const [ex3aTexts,  ex3aSolutions, ex3aExplanations] = getExExercises(makeGetNumberBCEx(getEx1), 3);
const [ex3bTexts,  ex3bSolutions, ex3bExplanations] = getExExercises(makeGetNumberBCEx(getEx2), 3);

const ex3Texts = [...ex3aTexts, ...ex3bTexts];
const ex3Solutions = [...ex3aSolutions, ...ex3bSolutions];
const ex3Explanations = [...ex3aExplanations, ...ex3bExplanations];
const idxs = shuffle(_range(ex3Texts.length));

export const TelBCs = () => {
    return (
        <FillStepper texts={idxs.map(i => ex3Texts[i])} solutions={idxs.map(i => ex3Solutions[i])} explanations={idxs.map(i => ex3Explanations[i])} />
    )
}
