import React from "react";

import { Exercise } from 'components/exercises/exercise';
import { ExerciseStepper } from 'components/exercises/exerciseStepper';
import { NoAnswer } from 'components/exercises/noAnswer';
import { Katex as K } from 'components/katex';
import _random from "lodash/random";
import _range from "lodash/range";
import { shuffle } from "utils/array";
import useId from 'hooks/useId';
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import { getVoorschrift1GStr, getVoorschrift1GFracStr } from "../tekenschema/drawings";
import { toComma } from "../rico/drawings";
import { toFrac, simplify } from "../rico/exercises";


const RICOS = _range(-10, 10).filter(x => x !== 0);


export const RicoPunt = () => {
    const ms = shuffle(RICOS).slice(0, 5);
    const x1s = shuffle(_range(-10, 10)).slice(0, ms.length);
    const y1s = shuffle(_range(-10, 10)).slice(0, ms.length);

    return (
        <ExerciseStepper>
        {
          ms.map((m, i) =>
            <React.Fragment key={i}>
              <RicoPuntSingle m={m} x1={x1s[i]} y1={y1s[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}

export const RicoPuntSingle = ({m, x1, y1}) => {
    const q = y1 - m*x1;
    const qStr = toComma(q);
    const voorschr = getVoorschrift1GStr(m, q);
    const mStr = toComma(m);
    const x1Str = toComma(x1);
    const y1Str = toComma(y1);
    const mx = m*x1;
    const mxStr = toComma(mx);

    return (
        <Exercise>
          Wat is <strong>het functievoorschrift</strong> van de eerstegraadsfunctie die door het punt <K>{String.raw`(${x1Str};${y1Str})`}</K> gaat en waarvan de richtingscoëfficiënt gelijk is aan <K>{mStr}</K>?
          <NoAnswer solution={<K>{voorschr}</K>}>
          <div>
          Het voorschrift van een eerstegraadsfunctie heeft altijd de vorm <K>f(x) = mx + q</K>. Hierbij is <K>m</K> de rico. In de opgave staat dat de rico gelijk is aan <K>{mStr}</K>. <strong>We kunnen <K>m</K> dus al meteen vervangen door de gegeven rico</strong>:
          <K display>{String.raw`f(x) = ${mStr}\cdot x + q`}</K>
          <br/>
          <strong>Om <K>q</K> te vinden, vullen we het gegeven punt in in het voorschrift.</strong> Als het punt <K>{String.raw`(${x1Str};${y1Str})`}</K> op de grafiek van <K>f</K> ligt, dan betekent dit dat <K>{String.raw`f(${x1Str}) = ${y1Str}`}</K>. We vervangen <K>x</K> in het voorschrift door <K>{x1Str}</K>. De uitkomst hiervan moet gelijk zijn aan <K>{y1Str}</K>:
          <K display>{String.raw`
            \begin{aligned}
              f(${x1Str}) &= ${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}\\
            \end{aligned}
          `}</K>
          <br/>
          Hieruit volgt de vergelijking <K>{String.raw`${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}`}</K> die we kunnen oplossen naar <K>q</K>.
          <K display>{String.raw`
            \begin{aligned}
              ${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}\\
              &\Udarr\\
              ${mxStr} + q &= ${y1Str}\\
              &\Udarr\\
              q &= ${y1Str} ${-mx >= 0 ? `+ ${toComma(-mx)}` : toComma(-mx)}\\
              &\Udarr\\
              q &= ${qStr}
            \end{aligned}
          `}</K>
          <br/>
          We zien dat <K>{`q=${qStr}`}</K>. Uit de gegevens wisten we ook dat <K>{`m=${mStr}`}</K>. Het voorschrift van <K>f</K> is dus:
          <K display>{voorschr}</K>
          </div>
          </NoAnswer>
        </Exercise>
    );
};


export const RicoTweePunten = () => {
    const x1s = shuffle(_range(-10, 10)).slice(0, 5);
    const y1s = shuffle(_range(-10, 10)).slice(0, x1s.length);
    const x2s = x1s.map(x1 => shuffle(_range(-10, 10)).filter(x => x !== x1)[0]);
    const y2s = y1s.map(y1 => shuffle(_range(-10, 10)).filter(y => y !== y1)[0]);

    return (
        <ExerciseStepper>
        {
          x1s.map((x1, i) =>
            <React.Fragment key={i}>
              <RicoTweePuntenSingle x1={x1} y1={y1s[i]} x2={x2s[i]} y2={y2s[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
};


export const RicoTweePuntenSingle = ({x1, y1, x2, y2}) => {
    const dy = y2 - y1;
    const dx = x2 - x1;
    const [mNumOrig, mDenomOrig] = [dy, dx];
    const [qNumOrig, qDenomOrig] = [y1*dx - dy*x1, dx];
    const m = mNumOrig/mDenomOrig;
    const q = qNumOrig/qDenomOrig;
    const mOrigStr = String.raw`\frac{${mNumOrig}}{${mDenomOrig}}`;
    const qOrigStr = String.raw`\frac{${qNumOrig}}{${qDenomOrig}}`;
    const mStr = toFrac(mNumOrig, mDenomOrig);
    const qStr = toFrac(qNumOrig, qDenomOrig);
    const voorschr = getVoorschrift1GFracStr(mNumOrig, mDenomOrig, qNumOrig, qDenomOrig);

    const x1Str = toComma(x1);
    const y1Str = toComma(y1);
    const x2Str = toComma(x2);
    const y2Str = toComma(y2);
    const mx = m*x1;
    const [mNum, mDenom] = simplify(mNumOrig, mDenomOrig);
    const mxStr = toFrac(mNum*x1, mDenom);
    const mxInvStr = toFrac(-mNum*x1, mDenom);
    const mxOrigStr = mDenom === 1 ? mxStr : String.raw`\frac{${mNum*x1}}{${mDenom}}`;

    return (
        <Exercise>
          Wat is <strong>het functievoorschrift</strong> van de eerstegraadsfunctie die door de punten <K>{String.raw`(${x1Str};${y1Str})`}</K> en <K>{String.raw`(${x2Str};${y2Str})`}</K> gaat?
          <NoAnswer solution={<K>{voorschr}</K>}>
          <div>
          Het voorschrift van een eerstegraadsfunctie heeft altijd de vorm <K>f(x) = mx + q</K>. Hierbij is <K>m</K> de rico. Als we twee punten <K>(x_1;y_1)</K> en <K>(x_2;y_2)</K> kennen die op de functie liggen, dan kunnen we de rico berekenen met de volgende formule:
          <K display>{`m=\\frac{y_2-y_1}{x_2-x_1}`}</K>
          In de opgave staat dat de functie door de punten <K>{String.raw`(${x1Str};${y1Str})`}</K> en <K>{String.raw`(${x2Str};${y2Str})`}</K> gaat. Invullen in de formule voor de rico geeft:
          <K display>{String.raw`
            \begin{aligned}
              m &= \frac{${y2}-${y1 < 0 ? `(${y1Str})` : y1Str}}{${x2}-${x1 < 0 ? `(${x1Str})` : x1Str}}\\
                &= ${mOrigStr}\\
                ${mOrigStr !== mStr ? `&= ${mStr}` : ''}
            \end{aligned}
          `}</K>
          <strong>We kunnen de <K>m</K> in <K>f(x) = mx + q</K> nu vervangen door de gevonden rico</strong>:
          <K display>{String.raw`f(x) = ${mStr}\cdot x + q`}</K>
          <br/>
          <strong>Om <K>q</K> te vinden, vullen we een van de gegeven punten in in het voorschrift.</strong> Het maakt niet uit welk punt, beide punten zullen tot dezelfde <K>q</K> leiden. We kiezen bijvoorbeeld voor het punt <K>{String.raw`(${x1Str};${y1Str})`}</K>.<br/>
          <br/>
          Als <K>{String.raw`(${x1Str};${y1Str})`}</K> op de grafiek van <K>f</K> ligt, dan betekent dit dat <K>{String.raw`f(${x1Str}) = ${y1Str}`}</K>. We vervangen <K>x</K> in het voorschrift door <K>{x1Str}</K>. De uitkomst hiervan moet gelijk zijn aan <K>{y1Str}</K>:
          <K display>{String.raw`
            \begin{aligned}
              f(${x1Str}) &= ${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}\\
            \end{aligned}
          `}</K>
          <br/>
          Hieruit volgt de vergelijking <K>{String.raw`${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}`}</K> die we kunnen oplossen naar <K>q</K>.
          <K display>{String.raw`
            \begin{aligned}
              ${mStr}\cdot ${x1 < 0 ? `(${x1Str})` : x1Str} + q = ${y1Str}\\
              &\Udarr\\
              ${mxStr} + q &= ${y1Str}\\
              &\Udarr\\
              q &= ${y1Str} ${-mx >= 0 ? `+ ${mxInvStr}` : `- ${mxStr}`}\\
              &\Udarr\\
              q &= ${qStr}
            \end{aligned}
          `}</K>
          <br/>
          We zien dat <K>{`q=${qStr}`}</K>. We vonden ook al dat <K>{`m=${mStr}`}</K>. Het voorschrift van <K>f</K> is dus:
          <K display>{voorschr}</K>
          </div>
          </NoAnswer>
        </Exercise>
    );
  };
