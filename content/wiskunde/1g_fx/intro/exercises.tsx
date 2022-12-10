import React from "react";

import MultipleChoiceStepper from 'components/exercises/multipleChoiceStepper';
import { getVoorschrift1GStr } from '../tekenschema/drawings';
import { Katex as KX } from 'components/katex';
import { FillString } from 'components/exercises/fillAnswer';
import { NoAnswer } from 'components/exercises/noAnswer';
import { Exercise } from 'components/exercises/exercise';
import _random from "lodash/random";

import { AnnotatedFx } from "./drawings";
import MariaSegwaySvg from './maria_segway';



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
        "f(x) = (2 x + 1)^{-1}",
        "f(x) = \\frac{x + 2}{3}",
        "f(x) = 0x - 3",
    ].map(t => <>Is <KX>{t}</KX> een eerstegraadsfunctie in <KX>x</KX>?</>);
    const choices = texts.map(() => ["Ja", "Neen"]);
    const solutions = [
        0, 1, 1, 0, 1
    ];
    const explanations = [
    <React.Fragment>
        Je kan <KX>{"f(x) = -5 + x"}</KX> herschrijven als <KX>{"f(x) = x + (- 5)"}</KX>. Het is dus een eerstegraadsfunctie met <KX>{"m = 1"}</KX> en <KX>{"q = -5"}</KX>.
    </React.Fragment>,
    <React.Fragment>
        Je zou <KX>{"f(x) = 3"}</KX> kunnen herschrijven als <KX>{String.raw`f(x) = 0\cdot x + 3`}</KX>, zodat <KX>{"m = 0"}</KX> en <KX>{"q = 3"}</KX>. De definitie van een eerstegraadsfunctie zegt echter dat <KX>{"m"}</KX> niet gelijk mag zijn aan nul, omdat dan <KX>{"x"}</KX> wegvalt en de hoogste macht van <KX>{"x"}</KX> niet langer gelijk is aan <KX>{"1"}</KX>. Het is dus geen eerstegraadsfunctie (wel een <em>nuldegraadsfunctie</em>).
    </React.Fragment>,
    <React.Fragment>
        <KX>{String.raw`f(x) = (2\cdot x + 1)^{-1}`}</KX> is hetzelfde als <KX>{String.raw`f(x) = \frac{1}{2\cdot x + 1}`}</KX>. Bij een eerstegraadsfunctie mag <KX>{"x"}</KX> niet in de noemer staan. Dit is dus geen eerstegraadsfunctie.
    </React.Fragment>,
    <React.Fragment>
        Je kan <KX>{String.raw`f(x) = \frac{x + 2}{3}`}</KX> herschrijven als <KX>{String.raw`f(x) = \frac{1}{3}\cdot x + \frac{2}{3}`}</KX>. Het is dus een eerstegraadsfunctie met <KX>{String.raw`m = \frac{1}{3}`}</KX> en <KX>{String.raw`q = \frac{2}{3}`}</KX>.
    </React.Fragment>,
    <React.Fragment>
        De definitie van een eerstegraadsfunctie zegt dat <KX>{"m"}</KX> niet gelijk mag zijn aan nul, omdat dan <KX>{"x"}</KX> wegvalt en de hoogste macht van <KX>{"x"}</KX> niet langer gelijk is aan <KX>{"1"}</KX>. <KX>f(x) = 0x - 3</KX> is dus geen eerstegraadsfunctie (wel een <em>nuldegraadsfunctie</em>).
    </React.Fragment>,
    ];

    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions} explanations={explanations} Wrapper={props => <div {...props}/>}/>
    );
}


export const Herken1GFxTexts = () => {
    const texts = [
        <React.Fragment>
          Het totaalbedrag <KX>y</KX> dat je moet betalen na een taxirit van <KX>x</KX> minuten. Iedere minuut komt er 30 eurocent bij het starttarief van 3 euro bij.
        </React.Fragment>,
        <React.Fragment>
          De oppervlakte <KX>y</KX> van een vierkant met zijde <KX>x</KX>.
        </React.Fragment>,
        <React.Fragment>
          De hoek <KX>y</KX> die de grote wijzer van een horloge heeft afgelegd na <KX>x</KX> kwartieren. Per kwartier vergroot de hoek met <KX>{`90\\deg`}</KX>.
        </React.Fragment>,
        <React.Fragment>
          De winst <KX>y</KX> die je maakt bij een cakeverkoop nadat je <KX>x</KX> sneden cake hebt verkocht. Je kocht in de winkel zelf voor €25 aan cakes en vraagt 50 eurocent voor iedere snede cake.
          </React.Fragment>,
        <React.Fragment>
          De omtrek <KX>y</KX> van een cirkel met straal <KX>x</KX>.
        </React.Fragment>,
        <React.Fragment>
          De afstand <KX>y</KX> die een voorwerp in vrije val heeft afgelegd na <KX>x</KX> seconden. De snelheid van het voorwerp begint bij <KX>{`0~\\si{m/s}`}</KX> en verhoogt iedere seconde met <KX>{`9{,}81~\\si{m/s}`}</KX>.
        </React.Fragment>,
    ].map(t => (
        <React.Fragment>
            Is <KX>y</KX> een eerstegraadsfunctie van <KX>x</KX>?<br/><br/>
            { t }
        </React.Fragment>
    ));
    const choices = texts.map(() => [
        <><KX>y</KX> is <strong>geen</strong> eerstegraadsfunctie van <KX>x</KX>.</>,
        <><KX>y</KX> is <strong>wel</strong> een eerstegraadsfunctie van <KX>x</KX>.</>,
    ]);
    const solutions = [1, 0, 1, 1, 1, 0];
    const explanations = [
        <React.Fragment>
          Per minuut komt er een vast bedrag van 30 eurocent bij het starttarief van 3 euro bij. Het totaalbedrag <KX>y</KX> is dus een eerstegraadsfunctie van <KX>x</KX>.<br/><br/>
          Het functievoorschrift is <KX>{`y = 0{,}30x+3`}</KX>.
        </React.Fragment>,
        <React.Fragment>
          De oppervlakte van een vierkant is gelijk aan het kwadraat van haar zijde. Als <KX>y</KX> de oppervlakte is en <KX>x</KX> de lengte van de zijde dan geldt dus dat <KX>y=x^2</KX>. We zien dat <KX>y</KX> <strong>geen</strong> eerstegraadsfunctie is van <KX>x</KX> (maar een tweedegraadsfunctie).
        </React.Fragment>,
        <React.Fragment>
          Per kwartier komt er een vaste hoek van <KX>{`90\\deg`}</KX> bij bij de afgelegde hoek. De afgelegde hoek <KX>y</KX> is dus een eerstegraadsfunctie van het aantal kwartieren <KX>x</KX>.<br/><br/>
          Het functievoorschrift is <KX>{`y = 90x`}</KX>.
        </React.Fragment>,
        <React.Fragment>
          Per verkochte snede cake verhoogt de winst met 50 eurocent. De winst <KX>y</KX> die je maakt is dus een eerstegraadsfunctie van het aantal verkochte sneden <KX>x</KX>.<br/><br/>
          Omdat je €25 aan cakes hebt aangekocht, is het functievoorschrift <KX>{`y = 0{,}50x-25`}</KX>.
        </React.Fragment>,
        <React.Fragment>
          De omtrek van een cirkel kan je berekenen door de straal van de cirkel te vermenigvuldigen met <KX>{`2\\pi`}</KX>. Als <KX>y</KX> de omtrek is en <KX>x</KX> de straal, dan geldt er dus dat <KX>{`y=2\\pi x`}</KX>. We zien dat <KX>y</KX> een eerstegraadsfunctie is van <KX>x</KX> met <KX>{`m=2\\pi`}</KX> en <KX>{`q=0`}</KX>.
        </React.Fragment>,
        <React.Fragment>
          Per seconde verhoogt de snelheid van het vallende voorwerp met <KX>{`9{,}81~\\si{m/s}`}</KX>. De <em>snelheid</em> is dus een eerstegraadsfunctie van het aantal seconden dat het voorwerp al aan het vallen is. In de opgave wordt echter gevraagd of de <em>afgelegde afstand</em> een eerstegraadsfunctie is van het aantal seconden. Als de <em>snelheid</em> voortdurend verhoogt, zullen we echter in een seconde telkens <em>een grotere afstand</em> afleggen. De afgelegde afstand <KX>y</KX> is dus <em>geen</em> eerstegraadsfunctie van het aantal seconden <KX>x</KX>.<br/><br/>
          Voor de geïnteresseerde lezer: het functievoorschrift is hier <KX>{`y = \\frac{9{,}81}{2}x^2`}</KX>. Waar dit precies vandaan komt, ligt helaas buiten het bestek van deze les.
        </React.Fragment>,
    ];

    return (
        <MultipleChoiceStepper texts={texts} choices={choices} solutions={solutions} explanations={explanations} Wrapper={props => <div {...props}/>}/>
    );
};


export const MariaSegway = () => {
    return (
        <Exercise>
            <p>
            Maria rijdt met haar Segway een constante snelheid van <KX>300</KX> meter per minuut. Ze vertrekt van bij haar thuis en volgt de hele tijd een rechte baan. Bepaal een formule die aangeeft hoeveel meter ze van huis is na een bepaald aantal minuten rijden. Is dit een eerstegraadsfunctie?
            </p>
            <MariaSegwaySvg />
            <NoAnswer solution={<KX>f(x)=300x</KX>}>
              <>
                <ol>
                  <li><strong>Zoek de betekenis van <KX>x</KX> en <KX>y</KX></strong>: het aantal meter dat Maria van huis is, hangt af van hoeveel minuten ze aan het rijden is. <KX>y</KX> is dus "<em>het aantal meter van huis</em>" en <KX>x</KX> is "<em>het aantal minuten dat Maria rijdt</em>".</li>
                  <li><strong>Bepaal of <KX>y</KX> een eerstegraadsfunctie is van <KX>x</KX></strong>: Per minuut (<KX>x</KX>) komt er een vaste afstand bij <KX>y</KX> bij. <KX>y</KX> is dus een eerstegraadsfunctie van <KX>x</KX>.</li>
                  <li><strong>Bepaal <KX>m</KX></strong>: wanneer Maria één minuut langer rijdt, zal ze <KX>300</KX> meter verder van huis zijn. <KX>m</KX> is dus <KX>300</KX>.</li>
                  <li><strong>Bepaal <KX>q</KX></strong>: wanneer ze nul minuten heeft gereden (<KX>x=0</KX>), dan is ze thuis. Ze is dan met andere woorden nul meter van huis. <KX>q</KX> is dus gelijk aan <KX>0</KX>.</li>
                </ol>
                <AnnotatedFx m={300} mName="300 m meer per minuut" q={0} qName="0 meter ver op minuut 0" yName="aantal meter van huis" xName="aantal minuten" annotFontSize={75} />
               </>
            </NoAnswer>
        </Exercise>
    );
};