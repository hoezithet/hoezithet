import React from "react";

import { Exercise } from 'components/exercises/exercise';
import { ExerciseStepper } from 'components/exercises/exerciseStepper';
import { NoAnswer } from 'components/exercises/noAnswer';
import { Katex as K } from 'components/katex';
import { useAnnotArrow } from 'components/drawings/annotArrow';
import _random from "lodash/random";
import _range from "lodash/range";
import { shuffle } from "utils/array";
import useId from 'hooks/useId';
import { Fx } from "components/drawings/fx";
import { Plot } from "components/drawings/plot";
import { getVoorschrift1GStr } from "./drawings";
import { toComma } from "../rico/drawings";
import { toFrac } from "../rico/exercises";
import { Tekenschema1G } from "./drawings";


const RICOS = _range(-10, 10).filter(x => x !== 0);


export const FxTekenschema = () => {
    const ms = shuffle(RICOS).slice(0, 5);
    const qs = shuffle(_range(-10, 9)).slice(0, ms.length);

    return (
        <ExerciseStepper>
        {
          ms.map((m, i) =>
            <React.Fragment key={i}>
              <FxTekenschemaSingle m={m} q={qs[i]}/>
            </React.Fragment>
          )
        }
        </ExerciseStepper>
    );
}

export const FxTekenschemaSingle = ({m, q}) => {
    const voorschr = getVoorschrift1GStr(m, q);
    const zero = toFrac(-q, m);
    const zeroFrac = String.raw`\frac{${toComma(-q)}}{${toComma(m)}}`;
    const schema = <Tekenschema1G m={m} q={q} useFrac />;

    return (
        <Exercise>
          Wat is <strong>het tekenschema</strong> van de functie <K>{voorschr}</K>?
          <NoAnswer solution={schema}>
          <div>
            Om het tekenschema te maken, zoeken we eerst de <em>nulwaarde</em> van de eerstegraadsfunctie. Die is altijd gelijk aan <K>{String.raw`\frac{-q}{m}`}</K>. In het voorschrift <K>{voorschr}</K> is <K>{`m=${toComma(m)}`}</K> en <K>{`q=${toComma(q)}`}</K>. De breuk <K>{String.raw`\frac{-q}{m}`}</K> is voor deze functie dus gelijk aan <K>{zeroFrac === zero ? zero : `${zeroFrac} = ${zero}`}</K>.<br/>
            <br/>
            Vervolgens kijken we naar het teken van <K>m</K>. Omdat <K>{`m=${toComma(m)}`}</K>, is <K>m</K> {m < 0 ? "negatief" : "positief"}. De grafiek van de functie {m < 0 ? "daalt" : "stijgt"} dus. Dat betekent dat de functie voor het nulpunt {m < 0 ? "positief" : "negatief"} is en na het nulpunt {m < 0 ? "negatief" : "positief"}. We krijgen dan het volgende tekenschema:
            { schema }
          </div>
          </NoAnswer>
        </Exercise>
    );
};
