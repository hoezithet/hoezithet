import React from "react";
import Layout from '../components/layout';
import cookiesImg from '../../images/cookies/cookies.png';
import { styled } from '@mui/system';

const Img = styled('img')({
    margin: 'auto',
    width: '75%',
})

export default function Cookies() {
    const crumbs = [{
        slug: "/cookies",
        title: "Cookies"
    }];
    return (
        <Layout crumbs={ crumbs }>
            <Img src={ cookiesImg } />
            <p>
                Om deze website goed te laten werken, moeten we soms kleine
                bestanden op je computer zetten, zogenaamde <em>cookies</em>. De
                meeste grote websites doen dit.
            </p>
            <h1>Over cookies</h1>
            <p>
                Een cookie is een klein tekstbestand dat een website op je
                computer of smartphone opslaat wanneer je die site bezoekt. Zo
                onthoudt de website de pagina's die je hebt bezocht en jouw
                voorkeuren (zoals gebruikersnaam, taal, lettergrootte en andere
                voorkeuren) zodat je die niet bij ieder bezoek aan de site opnieuw
                hoeft in te vullen.
            </p>

            <h1>Hoe gebruiken wij cookies?</h1>
            <p>
                Wij gebruiken cookies om 

                <ul>
                    <li>te tellen door hoeveel personen een bepaalde pagina is bezocht;</li>
                    <li>te tellen hoeveel nieuwe gebruikers er zijn;</li>
                    <li>te kijken hoe lang personen gemiddeld op een bepaalde pagina blijven;</li>
                    <li>na te gaan waar gebruikers zoal vandaan komen (ruwweg, enkel het land van waaruit de request werd verstuurd) en via welke kanalen ze ons hebben bereikt;</li>
                </ul>

                De cookies worden gemaakt door <a href="https://analytics.google.com">Google Analytics</a> en <a
                    href="https://tagmanager.google.com">Google Tag Manager</a> en enkel
                Hoe Zit Het? kan de informatie bekijken die uit de cookies volgt.  De
                cookies bevatten <em>geen persoonlijke data</em>.
            </p>

            <h1>Hoe cookies wissen?</h1>
            <p>
                Je kunt cookies altijd controleren en/of wissen. Meer hierover kan je vinden
                via <a href="https://aboutcookies.org">deze link</a>. Je kan alle cookies op je computer
                    wissen en je kunt je browser zo instellen dat cookies geblokkeerd worden. Dit
                    betekent wel dat je daarna jouw voorkeuren bij ieder bezoek opnieuw moet
                    instellen en dat sommige delen van de website niet (naar behoren) werken.
            </p>
        </Layout>
    );
}
