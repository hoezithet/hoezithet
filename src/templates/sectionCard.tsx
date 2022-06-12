import React from "react";
import styled from "styled-components";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { Link } from "gatsby-theme-material-ui";

import COLORS from "../colors.js";
import { graphql } from "gatsby";


export interface CardImage {
    childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
    };
}

interface SectionItemProps {
    title: string;
    cardImage: CardImage;
    link: string;
    children?: React.ReactElement|string;
}

const StyledGrid = styled(Grid)`
    background-color: ${COLORS.NEAR_WHITE};
    height: 140px;
`;

const StyledCard = styled(Card)`

`;

export default function SectionCard({title, cardImage, link, children}: SectionItemProps) {
    const img = <GatsbyImage
        image={cardImage.childImageSharp.gatsbyImageData}
        alt={title}
        objectFit="cover"
        objectPosition="50% 50%" />;
    return (
        <Grid item xs={12} sm={4}>
            <StyledCard>
                <StyledGrid container justify="center">
                    <Grid item>
                        { img }
                    </Grid>
                </StyledGrid>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        <Link to={link} style={{color: "black"}}>{ title }</Link>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="div">
                        { children }
                    </Typography>
                </CardContent>
            </StyledCard>
        </Grid>
    );
}

export const cardImageFragment = graphql`fragment CardImageFragment on File {
  childImageSharp {
    gatsbyImageData(height: 140, placeholder: TRACED_SVG, layout: FIXED)
  }
}
`
