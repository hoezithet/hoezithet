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
        "dan is de grafiek van de functie **stijgend**.",
        "dan is de grafiek van de functie **dalend**.",
        "dan is de grafiek van de functie **vlak**.",
    ];
    const absMChoices = [
        "dan wordt de grafiek van de functie **steiler**.",
        "dan wordt de grafiek van de functie **vlakker**.",
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
        "dan ligt het snijpunt van de grafiek en de y-as **boven de x-as**.",
        "dan ligt het snijpunt van de grafiek en de y-as **onder de x-as**.",
        "dan ligt het snijpunt van de grafiek en de y-as **in de oorsprong**.",
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