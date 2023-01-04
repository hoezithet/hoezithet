import React from "react";

import MultipleChoiceStepper from 'components/exercises/multipleChoiceStepper';



export const InvloedM = () => {
    const texts = [
        "Wanneer $m$ **groter dan nul** is...",
        "Wanneer $m$ **kleiner dan nul** is...",
        "Wanneer $m$ **gelijk aan nul** is...",
        "Wanneer de **absolute waarde van $m$ groter** wordt...",
        "Wanneer de **absolute waarde van $m$ kleiner** wordt..."
    ];
    const signMChoices = [
        <span>dan is de grafiek van de functie <strong>stijgend</strong>.</span>,
        <span>dan is de grafiek van de functie <strong>dalend</strong>.</span>,
        <span>dan is de grafiek van de functie <strong>vlak</strong>.</span>,
    ];
    const absMChoices = [
        <span>dan wordt de grafiek van de functie <strong>steiler</strong>.</span>,
        <span>dan wordt de grafiek van de functie <strong>vlakker</strong>.</span>,
    ];
    const choices = [
        signMChoices,
        signMChoices,
        signMChoices,
        absMChoices,
        absMChoices,
    ];
    const solutions = [
        0, 1, 2, 0, 1
    ];
    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions}/>
    );
};


export const InvloedQ = () => {
    const texts = [
        "Wanneer $q$ **gelijk is aan nul**...",
        "Wanneer $q$ **groter is dan nul**...",
        "Wanneer $q$ **kleiner is dan nul**...",
    ];
    const signQChoices = [
        <span>dan ligt het snijpunt van de grafiek en de y-as <strong>boven de x-as</strong>.</span>,
        <span>dan ligt het snijpunt van de grafiek en de y-as <strong>onder de x-as</strong>.</span>,
        <span>dan ligt het snijpunt van de grafiek en de y-as <strong>in de oorsprong</strong>.</span>,
    ];
    const choices = [
        signQChoices,
        signQChoices,
        signQChoices,
    ];
    const solutions = [
        2, 0, 1
    ];
    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions}/>
    );
  };
