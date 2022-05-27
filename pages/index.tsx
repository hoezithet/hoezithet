import React from 'react';
import HzhTheme from '../components/theme';
import HzhAppBar from '../components/appbar';
import Sponsors from '../components/sponsors';
import Footer from '../components/footer';
import COLORS from '../colors.js';
import landingImg from "../../images/landing/landing_large.png";
import archer from "../../images/landing/archer.png";
import free from "../../images/landing/free.png";
import guts from "../../images/landing/guts.png";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import { Button, Link } from "gatsby-theme-material-ui";


const LandingImg = styled.img`
    margin: auto;
    width: 100%;
`

const WhyHzhTitle = styled.h2`
    font-size: 36pt;
    font-weight: normal;
    margin: 2rem;
`

const WhyHzhTitleSpan = styled.span`
    white-space: nowrap;
    font-weight: bold;
`

const WhyHzhItemImgBox = styled(Box)`
    border: .25rem solid ${COLORS.GOLD};
    border-radius: 1rem;
    height: 8rem;
    width: 8rem;
    padding: 1rem;
    background-color: ${COLORS.NEAR_WHITE};
`

const WhyHzhItemImg = styled.img`
    height: 100%;
`;

const WhyHzhTriangle = styled.div`
    width: 0;
    height: 0;
    border-top-width: 2rem;
    border-right-width: 3rem;
    border-left-width: 3rem;
    border-style: solid;
    border-color: ${COLORS.NEAR_WHITE} transparent transparent transparent;
    margin: auto;
    margin-bottom: 1rem;
`;

const WhyHzhBox = styled(Box)`
    background-color: rgba(255, 183, 0, 0.25)
`;

const ShowLessonButton = styled(Button)`
    color: ${COLORS.NEAR_WHITE};
    font-weight: bold;
    font-size: 18pt;
`;

interface WhyHzhItemProps {
    children: React.ReactElement|string;
    title: string;
    img: string;
}

function WhyHzhItem(props: WhyHzhItemProps) {
    return (
        <Grid item xs={ 12 } sm={ 4 } container direction="column" justify="flex-start" alignItems="center">
            <Grid item>
                <WhyHzhItemImgBox>
                    <WhyHzhItemImg src={ props.img } />
                </WhyHzhItemImgBox>
            </Grid>
            <Grid item>
                <h2>{ props.title }</h2>
            </Grid>
            <Grid item container justify="center">
                <Grid item xs={ 10 }>
                    { props.children }
                </Grid>
            </Grid>
        </Grid>
    );
}

export default function Landing() {
    const exampleUrl = "/lessen/fysica/krachten_1/krachtvector/";

    return (
        <HzhTheme>
            <>
            <HzhAppBar color="transparent" elevation={ 0 } />
            <Box px={2} py={4} display="flex" justifyContent="center" >
                <Link to={ exampleUrl }>
                    <LandingImg src={landingImg} />
                </Link>
            </Box>
            <Box id="why" textAlign="center" justifyContent="center">
                <WhyHzhTitle>Waarom <WhyHzhTitleSpan>Hoe Zit Het?</WhyHzhTitleSpan></WhyHzhTitle>
                <WhyHzhBox pb={6}>
                    <a href="#why">
                        <WhyHzhTriangle />
                    </a>
                    <Grid container spacing={4} justify="center" >
                        <WhyHzhItem title="Doelgericht" img={ archer }>
                            Elke les is gericht op één onderwerp. Zo kan je gaatjes in je kennis snel opvullen, zonder omwegen. 
                        </WhyHzhItem>
                        <WhyHzhItem title="Verteerbaar" img={ guts }>
                            Niemand houdt van saai. Daarom bestaan onze lessen steeds uit een heldere uitleg met veel illustraties. Zo helpen we je om alles in een handomdraai te begrijpen.
                        </WhyHzhItem>
                        <WhyHzhItem title="Gratis" img={ free }>
                            Omdat iedereen recht heeft op kennis, zijn alle lessen gratis. Voor vandaag. Voor morgen. Voor altijd.
                        </WhyHzhItem>
                        <Grid item>
                            <ShowLessonButton variant="contained" color="primary" size="large" to={ exampleUrl }>
                        Toon mij een voorbeeld!
                            </ShowLessonButton> 
                        </Grid>
                    </Grid>
                </WhyHzhBox>
                <Sponsors />
            </Box>
            <Footer />
            </>
        </HzhTheme>
    );
};
