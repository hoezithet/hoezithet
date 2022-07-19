import React from "react";
import Layout from '../components/layout';
import notFoundImg from '../../images/404/404.png';
import { styled } from '@mui/system';
import { Button, Link } from "gatsby-theme-material-ui";
import Box from '@mui/material/Box';

const Img = styled('img')({
    margin: 'auto',
    width: '50%',
})

const StyledBox = styled(Box)({
    textAlign: 'center',
});

export default function NotFoundPage() {
    const crumbs = [{
        slug: "",
        title: "404"
    }];
    return (
        <Layout crumbs={ crumbs }>
        <StyledBox>
            <Img src={ notFoundImg } />
            <h1>Hier zit je niet goed...</h1>
            <p>
                De pagina waar je naar surfte, bestaat helaas niet...
            </p>
            <Button variant="contained" color="primary" size="large" to="/lessen/">
                Ga naar alle lessen
            </Button>
        </StyledBox>
        </Layout>
    );
}
