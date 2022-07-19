import React from "react";
import Layout from '../components/layout';
import Grid from "@mui/material/Grid";
import { Button } from "gatsby-theme-material-ui";
import Box from "@mui/material/Box";
import { NearWhite } from "../components/shortcodes/color";
import donate from "../../images/trakteer/donate.png";
import { styled } from '@mui/system';

interface TrakteerProps {
    children: React.ReactNode;
    amount: string;
    icon: string;
    text: string;
    href: string;
}

function TrakteerButton(props: TrakteerProps) {
    return (
        <Grid item >
            <Button href={ props.href } variant="contained" color="primary" size="large">
                <Grid container direction="column" alignItems="center">
                    <Grid item>{ props.icon }</Grid>
                    <Grid item>{ props.text }</Grid>
                    <Grid item><NearWhite>{ `(${props.amount})` }</NearWhite></Grid>
                </Grid>
            </Button>
        </Grid>
    );
}

const TrakteerImg = styled('img')({
    display: 'block',
    margin: 'auto',
})

export default function Trakteer() {
    const crumbs = [{
        slug: "/trakteer",
        title: "Trakteer",
    }];
    return (
        <Layout crumbs={ crumbs } >
            <h1>🥤 Trakteer op een drankje!</h1>
            <Box width={ { xs: 3/4, md: 1/2 } } clone>
                <TrakteerImg src={ donate } />
            </Box>
            <p>
                Wil je Hoe Zit Het? graag steunen? Dat kan! Via onderstaande knoppen kan je Hoe Zit Het? trakteren op een symbolisch drankje! 🥤 Jouw traktatie zal integraal worden gebruikt om de website verder uit te breiden met meer lessen, meer illustraties en meer verlichte uitleg! 💡 Zo zorg jij er mee voor dat Hoe Zit Het? voor iedereen helemaal gratis kan blijven! 🙌
            </p>

            <Box my={ 4 }>
                <Grid container spacing={2} justifyContent="center">
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YZBJ7U5JFSQ8G&source=url" amount="€2" icon="🥤" text="Frisdrankje" />
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NHE8CFLULN9WG&source=url" amount="€4" icon="☕" text="Frappuccino"/>
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TCLFUBNZ3QUGN&source=url" amount="€10" icon="🍻" text="Tournée Générale!"/>
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8BH56ZVUG2BQ&source=url" amount="Eigen bedrag" icon="🎁" text="Zelf iets kiezen"/>
                </Grid>
            </Box>
        </Layout>
    );
}
