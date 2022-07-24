import React from "react";
import _random from 'lodash/random';
import { shuffle } from 'utils/array';

import MultipleChoiceStepper from 'components/exercises/multipleChoiceStepper';


const getEx1 = (i) => {
    const text = String.raw`Waar zijn de **beduidende cijfers** correct aangeduid?`;
    const numZeros = _random(1, 3);
    const numBcs = _random(1, 4);
    const zeros = "0".repeat(numZeros);
    const extras = Array.from({length: numBcs - 1}, () => _random(0, 9)).join("");
    const bcs = `${(i % 10) + 1}${extras}`;
    const choices = String.raw`
$0{,}${zeros}\underline{\orange{${bcs}}}$
$0{,}\underline{\orange{${zeros}${bcs}}}$
$\underline{\orange{0{,}${zeros}${bcs}}}$
$0{,}\underline{\orange{${zeros}}}${bcs}$
`.split('\n').slice(1, -1);
    const expl = String.raw`De beduidende cijfers beginnen vanaf het eerste cijfer dat *niet* gelijk is aan nul. Hier beginnen we vanaf de $${bcs[0]}$. ${numBcs === 1 ? "Er is dus maar één beduidend cijfer, namelijk" : "De beduidende cijfers zijn dus"} $${bcs}$.`;
    return [text, choices, expl];
}

const getExExercises = (getEx) => {
    const texts = [];
    const choices = [];
    const explanations = [];
    
    shuffle(Array(3).fill(0).map((_, idx) => idx)).forEach((idx) => {
        const [ex1Text, ex1Choices, ex1Expl] = getEx(idx);
        texts.push(ex1Text);
        choices.push(ex1Choices);
       	explanations.push(ex1Expl);
        });
    return [texts, choices, explanations]
}

const [ex1Texts,  ex1Choices, ex1Explanations] = getExExercises(getEx1);


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
    const exp = _random(2, 9) * (_random(0, 1) === 1 ? 1 : -1);
    const zeroDecimals = "0".repeat(numZeros);
    let nonDecimals = Array.from({length: numNonDecimals - 1}, () => _random(0, 9)).join("");
    nonDecimals = `${(i % 10) + 1}${nonDecimals}`;
    let nonZeroDecimals = Array.from({length: numNonZeroDecimals - 1}, () => _random(0, 9)).join("");
    nonZeroDecimals += _random(1, 9);
    const powTen = String.raw`\cdot 10^{${exp}}`;
    const choices = String.raw`
$\underline{\orange{${nonDecimals}{,}${zeroDecimals}${nonZeroDecimals}}}${powTen}$
$${nonDecimals}{,}${zeroDecimals}\underline{\orange{${nonZeroDecimals}}}${powTen}$
$\underline{\orange{${nonDecimals}{,}${zeroDecimals}${nonZeroDecimals}${powTen}}}$
$${nonDecimals}{,}\underline{\orange{${zeroDecimals}}}${nonZeroDecimals}${powTen}$
`.split('\n').slice(1, -1);
    const expl = String.raw`De beduidende cijfers beginnen vanaf het eerste cijfer dat *niet* gelijk is aan nul. Hier beginnen de beduidende cijfers dus meteen vanaf de $${nonDecimals[0]}$. Een macht van $10$ hoort nooit bij de beduidende cijfers, dus de $${powTen}$ mogen we niet aanduiden.`;
    return [text, choices, expl];
}

const [ex2Texts,  ex2Choices, ex2Explanations] = getExExercises(getEx2);

export const DuidBCAan2 = () => {
    return (
        <MultipleChoiceStepper texts={ex2Texts} choices={ex2Choices} explanations={ex2Explanations}/>
    );
};
