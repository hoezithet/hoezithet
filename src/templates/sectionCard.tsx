import React from "react";
import styled from "styled-components";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { CardActionArea } from "gatsby-theme-material-ui";
import Img from "gatsby-image/withIEPolyfill";
import COLORS from "../colors.js";
import { FixedObject } from "gatsby-image";
import { graphql } from "gatsby";


export interface CardImage {
    childImageSharp: {
        fixed: FixedObject
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
    const img = <Img fixed={cardImage.childImageSharp.fixed} objectFit="cover" objectPosition="50% 50%" />;
    return (
        <Grid item xs={12} sm={4}>
            <StyledCard>
                <CardActionArea to={ link }>
                    <StyledGrid container justify="center">
                        <Grid item>
                            { img }
                        </Grid>
                    </StyledGrid>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        { title }
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            { children }
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </StyledCard>
        </Grid>
    );
}

export const cardImageFragment = graphql`
    fragment CardImageFragment on File {
        childImageSharp {
            fixed(height: 140) {
                ...GatsbyImageSharpFixed_tracedSVG
            }
        }
    }
`