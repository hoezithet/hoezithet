import React from 'react';
import HzhAppBar from '../components/appbar';
import Sponsors from '../components/sponsors';
import Footer from '../components/footer';
import COLORS from '../colors.js';
import landingImg from "../../images/landing/landing_large.png";
import archer from "../../images/landing/archer.png";
import free from "../../images/landing/free.png";
import guts from "../../images/landing/guts.png";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { Button, Link } from "gatsby-theme-material-ui";
import { BaseLayout } from 'components/layout';

const LandingImg = styled('img')({
    margin: 'auto',
    width: '100%',
});

const WhyHzhTitle = styled('h2')({
    fontSize: '36pt',
    fontWeight: 'normal',
    margin: '2rem',
});

const WhyHzhTitleSpan = styled('span')({
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
});

const WhyHzhItemImgBox = styled(Box)({
    border: `.25rem solid ${COLORS.GOLD}`,
    borderRadius: '1rem',
    height: '8rem',
    width: '8rem',
    padding: '1rem',
    backgroundColor: COLORS.NEAR_WHITE,
});

const WhyHzhItemImg = styled('img')({
    height: '100%',
});

const WhyHzhTriangle = styled('div')({
    width: 0,
    height: 0,
    borderTopWidth: '2rem',
    borderRightWidth: '3rem',
    borderLeftWidth: '3rem',
    borderStyle: 'solid',
    borderColor: `${COLORS.NEAR_WHITE} transparent transparent transparent`,
    margin: 'auto',
    marginBottom: '1rem',
});

const WhyHzhBox = styled(Box)({
    backgroundColor: 'rgba(255, 183, 0, 0.25)',
});

const ShowLessonButton = styled(Button)({
    color: COLORS.NEAR_WHITE,
    backgroundColor: 'rgba(255, 183, 0)',
    fontWeight: 'bold',
    fontSize: '18pt',
});

interface WhyHzhItemProps {
    children: React.ReactElement|string;
    title: string;
    img: string;
}

function WhyHzhItem(props: WhyHzhItemProps) {
    return (
        <Grid item xs={ 12 } sm={ 4 } container direction="column" justifyContent="flex-start" alignItems="center">
            <Grid item>
                <WhyHzhItemImgBox>
                    <WhyHzhItemImg src={ props.img } />
                </WhyHzhItemImgBox>
            </Grid>
            <Grid item>
                <h2>{ props.title }</h2>
            </Grid>
            <Grid item container justifyContent="center">
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
        <BaseLayout barColor="transparent" barElevation={ 0 } >
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
                    <Grid container spacing={4} justifyContent="center" >
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
        </BaseLayout>
    );
};
