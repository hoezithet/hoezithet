import React, { useState, useContext } from "react";
import { graphql, useStaticQuery } from "gatsby";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { trackEvent } from "./matomo";
import LessonContext from "../contexts/lessonContext";

const feedbackBtnsQuery = graphql`{
  allFile(filter: {absolutePath: {glob: "**/images/feedback/lamp_*.png"}}) {
    edges {
      node {
        childImageSharp {
          gatsbyImageData(height: 75, placeholder: TRACED_SVG, layout: FIXED)
        }
        name
      }
    }
  }
}
`;

const FeedbackItem = (props) => {
    const imgData = useStaticQuery(feedbackBtnsQuery);
    const node = imgData.allFile.edges.find(({ node }) => node.name === props.imgName).node;
    return (
        <Grid container spacing={ 2 } alignItems="center" direction="column">
            <Grid item >
                <GatsbyImage image={node.childImageSharp.gatsbyImageData} alt={ props.imgName } />
            </Grid>
            <Grid item >
                <Button variant="contained" id={ props.id } onClick={ props.onClick } color="primary" disabled={ props.disabled }>{ props.children }</Button>
            </Grid>
        </Grid>
    );
}

const Feedback = (props) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const fbItemProps = [
        {
            imgName: "lamp_broken",
            id: "feedback_neg",
            text: "Niet duidelijk",
            action: "Negative Feedback",
            value: -1,
        },
        {
            imgName: "lamp_off",
            id: "feedback_neutr",
            text: "Redelijk duidelijk",
            action: "Neutral Feedback",
            value: 0,
        },
        {
            imgName: "lamp_on",
            id: "feedback_pos",
            text: "Heel duidelijk",
            action: "Positive Feedback",
            value: 1,
        },
    ];

    const lessonContext = useContext(LessonContext);

    const handleClick = (idx) => {
        setSelectedOption(idx);
        const { action, value } = fbItemProps[idx];
        const name = lessonContext?.title;
        trackEvent("Lesson Feedback", action, name, value);
    };

    return <>
        <h2>Hoe duidelijk vond je deze les?</h2>
        <Grid container spacing={ 2 }>
            {
                selectedOption === null ?
                null
                :
                <Grid item xs={ 12 }>
                    <Grid container justifyContent="center">
                        <Grid item >
                            Bedankt voor je feedback!
                        </Grid>
                    </Grid>
                </Grid>
            }
            { fbItemProps.map(({imgName, id, text}, idx) =>
                <Grid item xs={ 4 } key={ id }>
                    <FeedbackItem imgName={ imgName } id={ id } onClick={ () => handleClick(idx) } disabled={ selectedOption !== null }
                     selected={ selectedOption === idx }>
                       { text }
                    </FeedbackItem>
                </Grid>
               )
            }
        </Grid>
    </>;
}

export default Feedback;
