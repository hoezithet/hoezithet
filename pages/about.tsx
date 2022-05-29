import React from "react";
import Layout from "components/layout";
import COLORS from "colors";
import demotivated from "../images/about/leerling_gedemotiveerd.png";
import bfg_watch from "../images/about/HZH_GVR_watching.png";
import bfg_run from "../images/about/HZH_GVR_run.png";
import bfg_lift from "../images/about/HZH_GVR_lifter.png";
import floris from "../images/about/floris.jpg";
import Image from 'next/image';


const Story = () => {
    return (
        <>
            <cite>
                Het is zover. Morgen examen wiskunde. Ik heb al heel de namiddag en avond zitten studeren, maar het lijkt niet op te schieten. De stress neemt toe en ik begin wat paniekerig te bladeren door de cursus om te zien hoeveel ik nog moet studeren. Duidelijk meer dan verwacht. En dan heb ik eens de oefeningen nog niet gemaakt… Laat staan mijn toetsen opnieuw geprobeerd. Wat is dat toch met dat vak? Waarvoor ga ik dat trouwens ooit gebruiken? De moed zakt in mijn schoenen. Het licht gaat uit. Dit lukt nooit... 😞
            </cite>
            <Image src={ demotivated } />
            <style jsx>{`
                cite {
                    color: ${COLORS.GRAY};
                }
            `}</style>
        </>
    );
};


const BFG = () => {
    return (
        <>
            <p>
                Misschien herken je het bovenstaande verhaal wel, net als veel leerlingen van het middelbaar. Mijn naam is Floris De Feyter 👋 en tussen ons gezegd en gezwegen vind ik wiskunde en wetenschappen eigenlijk heel interessant. Het doet wat pijn om te zien dat de vakken die ik zelf heel graag doe zulke angst en paniek kunnen veroorzaken bij leerlingen. Het voelt alsof veel leerlingen bang zijn voor de Grote Vriendelijke Reus, terwijl ze hem <b>nooit echt hebben leren kennen</b>.
            </p>
            <Image src={ bfg_watch } />
            <Image src={ bfg_run } />
            <h2>Wetenschap verlicht 💡</h2>
            <p>
                Met Hoe Zit Het? wil ik het studeren van <b>wetenschap en wiskunde voor leerlingen verlichten</b>. Ik zou leerlingen op de schouder van de reus willen laten staan en hen tonen dat het uitzicht eigenlijk wel best mooi is. Leerstof wetenschap en wiskunde mag leerlingen geen slapeloze nachten bezorgen, vind ik, maar het moet hen een inwendig <b>vreugdesprongetje geven bij elke nieuwe “Aha!”</b>.
            </p>
            <p>
                Met Hoe Zit Het? wil ik leerlingen tonen dat <b>wetenschap verlicht</b>.
            </p>
            <Image src={ bfg_lift } /> 
            <style jsx>{`
                img {
                    display: block;
                    margin: auto;
                    max-width: 100%;
                    width: 75%;
                }
            `}</style>
        </>
    );
};

const AboutAuthor = () => {
    return (
        <>
            <p>
            <Image src={ floris } alt="Floris De Feyter, auteur van Hoe Zit Het?" />
            </p>
            <p>
            Van opleiding ben ik industrieel ingenieur elektronica-ICT en momenteel ben ik bezig aan een doctoraat over computervisie. Afgelopen jaren heb ik in mijn vrije tijd heel wat bijlessen wiskunde en fysica gegeven. Het leukste daaraan was om de blik van de leerlingen te zien opklaren eens <q>het lichtje ging branden</q>. Dat wil ik met Hoe Zit Het? ook graag bereiken door mijn uiterste best te doen om de leerstof helder uit te leggen aan de hand van sprekende illustraties.
            </p>
            <p>
            Als je vragen of opmerkingen over de site hebt, mag je me altijd een mailtje sturen via <a href="mailto:floris@hoezithet.nu">floris@hoezithet.nu</a> of me contacteren via de <a href="https://fb.me/hoezithet">Facebookpagina van Hoe Zit Het?</a>.
            </p>
            <style jsx>{`
                img {
                    display: block;
                    margin: auto;
                    max-width: 100px;
                    width: 75%;
                    border-radius: 5px;
                }
            `}</style>
        </>
    );
};


export default function About() {
    const crumbs = [{
        slug: "/about",
        title: "Over Hoe Zit Het?",
    }];
    return (
        <Layout crumbs={ crumbs }>
            <h1>Over de website</h1>
            <Story />
            <BFG />
            <h1>Over de auteur</h1>
            <AboutAuthor/>
        </Layout>
    );
}
