import React from "react";
import Layout from '../components/layout';
import Grid from "@mui/material/Grid";
import { Button } from "gatsby-theme-material-ui";
import Box from "@mui/material/Box";
import { NearWhite } from "../components/shortcodes/color";
import donate from "../../images/trakteer/donate.png";
import { styled } from '@mui/system';
import floris from "../../images/about/floris.jpg";
import { ProfileImg } from 'pages/about';


interface TrakteerProps {
    amount?: string|null;
    icon: string;
    text: string;
    href: string;
}

function TrakteerButton({href, amount = null, text, icon}: TrakteerProps) {
    return (
        <Grid item >
            <Button href={ href } variant="contained" color="primary" size="large">
                <Grid container direction="column" alignItems="center">
                    <Grid item>{ icon } <strong>{ text }</strong> { amount !== null ? `(${amount})` : null }</Grid>
                </Grid>
            </Button>
        </Grid>
    );
}

const TrakteerImg = styled('img')({
    display: 'block',
    margin: 'auto',
})


const Frisdrankje = () => <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YZBJ7U5JFSQ8G&source=url" amount="€2" icon="🥤" text="Frisdrankje" />;
const Frappuccino = () => <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NHE8CFLULN9WG&source=url" amount="€4" icon="☕" text="Frappuccino"/>;
const Tournee = () => <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TCLFUBNZ3QUGN&source=url" amount="€10" icon="🍻" text="Tournée Générale!"/>;
const NaarKeuze = () => <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8BH56ZVUG2BQ&source=url" icon="🎁" text="Bedrag naar keuze"/>;

export const TrakteerButtons = () => {
    return (
        <Box my={ 4 } mx="auto">
            <Grid container spacing={2} justifyContent="center">
                <Frisdrankje />
                <Frappuccino />
                <Tournee />
                <NaarKeuze />
            </Grid>
        </Box>
    );
};

export default function Trakteer() {
    const crumbs = [{
        slug: "/trakteer",
        title: "Trakteer",
    }];
    return (
        <Layout crumbs={ crumbs } >
            <h1>🥤 Trakteer op een drankje!</h1>
            <Grid container spacing={ 2 } alignContent="center">
                <Grid item xs={ 12 } md={ 2 }>
                    <ProfileImg src={ floris } alt="Floris De Feyter, auteur van Hoe Zit Het?" />
                </Grid>
                <Grid item xs={ 12 } md={ 10 }>
                    <p>
                        Hallo daar! Mijn naam is Floris en in mijn vrije tijd bouw ik aan de website die je nu bezoekt! 😉 Alle lessen zijn gratis en bevatten geen reclame. Zo'n website online houden is helaas niet gratis... Hiervoor val ik terug op giften van bezoekers.
                    </p>
                    <p>
                        <strong>Wil jij meehelpen om Hoe Zit Het? online te houden?</strong> Met onderstaande knoppen kan je een gift doen. ❤️
                    </p>
                    <p>
                        Bedankt! 🤗
                    </p>
                </Grid>
                <TrakteerButtons/>
            </Grid>
        </Layout>
    );
}
