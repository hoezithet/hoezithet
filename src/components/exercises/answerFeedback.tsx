import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import { gsap } from "gsap";

import { getRandomArrElement } from "utils/array";
import useExpandable from "hooks/useExpandable";

import { ReadableAnswerSolution } from "./answerSolution";


const FeedbackPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
}));

type PositiveFeedbackProps = {

};

const PositiveFeedback = ({}: PositiveFeedbackProps) => {
    const correctMessages = [
        "Juist!",
        "Klopt!",
        "Correct!",
        "Helemaal goed!"
    ];

    const correctEmojis = [
        "🎉", "🎈", "🎊", "🥳", "👍", "💪", "👏",
        "🕺", "💃"
    ];
    
    const [msg] = useState(getRandomArrElement(correctMessages));
    const [emoji] = useState(getRandomArrElement(correctEmojis));

    return (
        <span>
            { `${msg} ${emoji}` }
        </span>
    );
};

type NeutralFeedbackProps = {
    solution: React.ReactNode|React.ReactNode[],
};

const NegativeFeedback = ({ solution }: NeutralFeedbackProps) => {
    const incorrectMessages = [
        "Niet juist...",
        "Dat klopt niet helaas...",
        "Jammer, dat is niet correct...",
        "Dat is helaas niet het juiste antwoord..."
    ];

    const incorrectEmojis = [
        "😕", "😩", "🤷", "🤷‍♂️", "🤷‍♀️"
    ];
    
    const [msg] = useState(getRandomArrElement(incorrectMessages));
    const [emoji] = useState(getRandomArrElement(incorrectEmojis));

    return (
        <span>
            { `${msg} ${emoji} ` }
            <NeutralFeedback solution={solution} />
        </span>
    );
};


const NeutralFeedback = ({ solution }: NeutralFeedbackProps) => {
    const singleCorrectAnswerText = "Het juiste antwoord is ";
    const multCorrectAnswersText = "De juiste antwoorden zijn ";
    
    return (
        <span>
            { Array.isArray(solution) ? (
                  solution.length > 1 ?
                  multCorrectAnswersText
                  : singleCorrectAnswerText
              )
              : singleCorrectAnswerText }
            <ReadableAnswerSolution solution={ solution } />
            { "." }
        </span>
    );
};

type AnsFeedbackProps = {
    solution: React.ReactNode|React.ReactNode[],
    explanation?: React.ReactNode,
    correct?: boolean|null,
};

export const AnswerFeedback = ({ solution, explanation, correct }: AnsFeedbackProps) => {
    const [bodyRef, wrapperRef, isExpanded, setIsExpanded] = useExpandable(false, (isExpanded) => {
        isExpanded ? setButtonText(HIDE_TEXT) : setButtonText(SHOW_TEXT);
    });
    const [SHOW_TEXT, HIDE_TEXT] = ["Toon uitleg", "Verberg uitleg"];
    const [buttonText, setButtonText] = React.useState(SHOW_TEXT);

    return (
        <FeedbackPaper elevation={0} variant="outlined">
            <b>
                {
                    correct === null ?
                    <NeutralFeedback solution={ solution } />
                    : (
                        correct ?
                        <PositiveFeedback/>
                        : <NegativeFeedback solution={ solution } />
                    )
                }
            </b>
            {
                explanation ?
                <>
                    <div ref={wrapperRef} style={{overflow: "scroll"}}>
                        <div ref={bodyRef}>
                            { explanation }
                        </div>
                    </div>
                    <Button onClick={() => setIsExpanded(prev => !prev)}>
                        { buttonText }
                    </Button>
                </>
                :
                null
            }
        </FeedbackPaper>
    );
}
