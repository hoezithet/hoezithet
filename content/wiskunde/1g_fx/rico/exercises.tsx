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
import { DiffQuotPoints, toComma } from "./drawings";


export const simplify = (numerator, denominator) => {
    const getGCD = (a, b) => {
        return b ? getGCD(b, a%b) : a;
    };
    const gcd = getGCD(numerator, denominator);
    return [numerator/gcd, denominator/gcd];
};


const isSimplestFrac = (numer, denom) => {
    const [sn, sd] = simplify(numer, denom);
    return sn === numer && sd === denom;
};


export const toFrac = (numerator, denominator) => {
    if (denominator === 1) {
        return `${numerator}`;
    }
    [numerator, denominator] = simplify(numerator, denominator);
    if (denominator < 0 && numerator > 0) {
        numerator *= -1;
        denominator *= -1;
    }
    if (denominator === 1) {
        return `${numerator}`;
    } else {
        return String.raw`\frac{${numerator}}{${denominator}}`;
    }
}


export const RicoTweePunten = () => {
    const x1s = shuffle(_range(-10, 9)).slice(0, 5);
    const x2s = x1s.map(x1 => _random(x1 + 1, 10));
    const y1s = shuffle(_range(-10, 9)).slice(0, x1s.length);
    const y2s = y1s.map(y1 => _random(y1 + 1, 10));

    return (
        <ExerciseStepper>
        {
          x1s.map((x1, i) =>
            <React.Fragment key={i}>
              <RicoTweePuntenSingle x1={x1} x2={x2s[i]} y1={y1s[i]} y2={y2s[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}

const getChoices = (x1, y1, x2, y2, asFrac=true) => {
    let choices = [
        [y2 - y1, x2 - x1],
        [y2 - y1, x1 - x2],
    ];

    if (x2 - x1 !== y2 - y1) {
        choices.push([x2 - x1, y2 - y1]);
    } else {
        choices.push([x2 - x1, y1 - y2]);
    }

    return choices.map(c => <K>{`m = ${asFrac ? toFrac(c[0], c[1]) : toComma(c[0]/c[1])}`}</K>);
}

export const RicoTweePuntenSingle = ({x1, x2, y1, y2}) => {
    const choices = getChoices(x1, y1, x2, y2);

    return (
        <Exercise>
          Wat is de richtingscoëfficiënt van de eerstegraadsfunctie die gaat  door de punten <K>{`(${x1}, ${y1})`}</K> en <K>{`(${x2}, ${y2})`}</K>?
          <MultipleChoice choices={choices} solution={0}>
          <div>
            Om de richtingscoëfficiënt <K>m</K> van een eerstegraadsfunctie te berekenen die gaat door twee gegeven punten <K>(x_1, y_1)</K> en <K>(x_2, y_2)</K>, kunnen we de volgende formule gebruiken:
            <K display>
            {String.raw`m = \frac{y_2 - y_1}{x_2 - x_1}`}
            </K>
            Er is gegeven dat de functie door de punten <K>{`(${x1}, ${y1})`}</K> en <K>{`(${x2}, ${y2})`}</K> gaat. Invullen geeft dan:
            <K display>
            {String.raw`
              \begin{aligned}
              m &= \frac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}}\\
              &= \frac{${y2 - y1}}{${x2 - x1}}\\
              ${isSimplestFrac(y2 - y1, x2 - x1) ? '' : `&= ${toFrac(y2 - y1, x2 - x1)}`}
              \end{aligned}
            `}
            </K>
          </div>
          </MultipleChoice>
        </Exercise>
    );
};


export const RicoGrafiek = () => {
    const ms = [-2,  0.5, 3.5, -1.5];
    const qs = [ 3, -2, 1,  0];
    const x1s = [0, -1, -1,  -1];

    return (
        <ExerciseStepper>
        {
          x1s.map((x1, i) =>
            <React.Fragment key={i}>
              <RicoGrafiekSingle x1={x1} m={ms[i]} q={qs[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}


export const RicoGrafiekSingle = ({m, q, x1}) => {
    const fx = x => m*x + q;
    const y1 = fx(x1);
    const x2 = x1 + 1;
    const y2 = fx(x2);
    const choices = getChoices(x1, y1, x2, y2, false);

    const isStijgend = m > 0;
    const dyAbs = Math.abs(y2 - y1);
    const plotProps = {
        xMin: -5, xMax: 5, yMin: -5, yMax: 5,
        gridProps: {major: 1, minor: 0.5, color: "light_gray", opacity: 0.5},
    };

    return (
        <Exercise>
          Wat is de richtingscoëfficiënt van de eerstegraadsfunctie die hieronder geplot is?
          <Plot {...plotProps}>
              <Fx fx={fx} />
          </Plot>
          <MultipleChoice choices={choices} solution={0}>
          <div>
            We kunnen de rico aflezen op de grafiek van een eerstegraadsfunctie door te kijken hoeveel eenheden de grafiek stijgt of daalt wanneer we vanaf de grafiek één eenheid opschuiven naar rechts. We vertrekken bijvoorbeeld vanaf het punt <K>{`(${toComma(x1)}; ${toComma(y1)})`}</K>. Als we één eenheid opschuiven naar rechts, zien we dat de grafiek <K>{`${toComma(dyAbs)}`}</K> {dyAbs === 1 ? "eenheid" : "eenheden"} {isStijgend ? "stijgt" : "daalt"}. {isStijgend ? "" : "Omdat de functie daalt, moeten we hier een minteken voor zetten om de rico te krijgen. "}De rico is dus gelijk aan <K>{`${toComma(m)}`}</K>.
            <Plot {...plotProps}>
              <DiffQuotPoints m={m} q={q} p1={[x1, y1]} p2={[x2, y2]} hideCoords />
            </Plot>
          </div>
          </MultipleChoice>
        </Exercise>
    );
  };