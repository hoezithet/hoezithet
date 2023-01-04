import React from "react";

import { Exercise } from 'components/exercises/exercise';
import { ExerciseStepper } from 'components/exercises/exerciseStepper';
import { MultipleChoice } from 'components/exercises/multipleChoice';
import { Katex as K } from 'components/katex';
import { useAnnotArrow } from 'components/drawings/annotArrow';
import _random from "lodash/random";
import _range from "lodash/range";
import { shuffle } from "utils/array";
import useId from 'hooks/useId';
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import { getVoorschrift1GStr } from "../tekenschema/drawings";
import { toComma } from "../rico/drawings";
import { NulpuntGraph1G } from "./drawings";


const RICOS = [1, 2, 4, 5, 10, -1, -2, -4, -5, -10];


export const FxNulpunt = () => {
    const ms = shuffle(RICOS).slice(0, 5);
    const qs = shuffle(_range(-10, 9)).slice(0, ms.length);

    return (
        <ExerciseStepper>
        {
          ms.map((m, i) =>
            <React.Fragment key={i}>
              <FxNulpuntSingle m={m} q={qs[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}


const getFxChoices = (m, q) => {
    const zero = toComma(-q/m);
    let choices = [`(${zero}; 0)`, `${zero}`];

    if (q !== 0) {
        choices = [...choices, `(0; ${zero})`, `0`];
    } else {
        choices = [...choices, `(0; ${toComma(m)})`, toComma(m)];
    }
    return choices.map(c => <K>{c}</K>);
};


export const FxNulpuntSingle = ({m, q}) => {
    const choices = getFxChoices(m, q);

    return (
        <Exercise>
          Wat is <strong>het nulpunt</strong> van de eerstegraadsfunctie met voorschrift <K>{getVoorschrift1GStr(m, q)}</K>?
          <MultipleChoice choices={choices} solution={0}>
          <div>
              De <em>nulwaarde</em> van een eerstegraadsfunctie is altijd <K>{String.raw`\frac{-q}{m}`}</K> en het <em>nulpunt</em> is dus altijd <K>{String.raw`(\frac{-q}{m}; 0)`}</K>. In het voorschrift <K>{getVoorschrift1GStr(m, q)}</K> is <K>{`m=${toComma(m)}`}</K> en <K>{`q=${toComma(q)}`}</K>. De breuk <K>{String.raw`\frac{-q}{m}`}</K> is voor deze functie dus gelijk aan <K>{String.raw`\frac{${toComma(-q)}}{${toComma(m)}} = ${toComma(-q/m)}`}</K> zodat het nulpunt <K>{`(${toComma(-q/m)}; 0)`}</K> is.<br/><br/>
              Vergeet niet dat het nul<em>punt</em> een <em>punt</em> is en dus bestaat uit een x- en een y-coördinaat. De x-coördinaat <K>{toComma(-q/m)}</K> noemen we de nul<em>waarde</em>.
          </div>
          </MultipleChoice>
        </Exercise>
    );
};


export const NulpuntGrafiek = () => {
    const ms = shuffle([1, 0.5, -1, -0.5, 0.5]);
    const qs = shuffle(_range(-5, 5)).slice(0, ms.length);

    return (
        <ExerciseStepper>
        {
          ms.map((m, i) =>
            <React.Fragment key={i}>
              <NulpuntGrafiekSingle m={m} q={qs[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}


const getGrafiekChoices = (m, q) => {
    const zero = toComma(-q/m);
    let choices = [`(${zero}; 0)`, zero];

    if (q !== 0) {
        choices.push(`(0; ${toComma(q)})`);
        if (m !== -1) {
            choices.push(toComma(q));
        } else {
            choices.push('0');
        }
    } else {
        choices = [...choices, `(0; ${toComma(m)})`, toComma(m)];
    }
    return choices.map(c => <K>{c}</K>);
};


export const NulpuntGrafiekSingle = ({m, q}) => {
    const fx = x => m*x + q;
    const choices = getGrafiekChoices(m, q);

    return (
        <Exercise>
          Wat is <strong>het nulpunt</strong> van de eerstegraadsfunctie die hieronder geplot is?
          <Plot gridProps={{major: 1, color: "light_gray", opacity: 0.5}}>
              <Fx fx={fx} />
          </Plot>
          <MultipleChoice choices={choices} solution={0}>
          <div>
            Het <em>nulpunt</em> van een eerstegraadsfunctie is het punt waar de grafiek de x-as snijdt. Dit gebeurt in het punt <K>{`(${toComma(-q/m)}; 0)`}</K>. Het nulpunt van de functie is dus <K>{`(${toComma(-q/m)}; 0)`}</K>. Vergeet niet dat het nul<em>punt</em> een <em>punt</em> is en dus bestaat uit een x- en een y-coördinaat. De x-coördinaat <K>{toComma(-q/m)}</K> noemen we de nul<em>waarde</em>.
            <NulpuntGraph1G m={m} q={q}/>
          </div>
          </MultipleChoice>
        </Exercise>
    );
};