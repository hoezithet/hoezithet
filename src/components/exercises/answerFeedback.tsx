import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";
import { gsap } from "gsap";

import { getRandomArrElement } from "../../utils/array";
import { theme } from "../theme";
import { ReadableAnswerSolution } from "./answerSolution";


const FeedbackPaper = styled(Paper)`
    padding: ${theme.spacing(1)}px;
    margin-top: ${theme.spacing(1)}px;
    margin-bottom: ${theme.spacing(2)}px;
`;

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

type NegativeFeedbackProps = {
    solution: React.ReactNode|React.ReactNode[],
};

const NegativeFeedback = ({ solution }: NegativeFeedbackProps) => {
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

    const singleCorrectAnswerText = "Het juiste antwoord was ";
    const multCorrectAnswersText = "De juiste antwoorden waren "; 
    
    return (
        <span>
            { `${msg} ${emoji} ` }
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
        </span>
    );
};

type AnsFeedbackProps = {
    solution: React.ReactNode|React.ReactNode[],
    explanation?: React.ReactNode,
    correct: boolean,
};

export const AnswerFeedback = ({ solution, explanation, correct }: AnsFeedbackProps) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const nodeHeight = useRef(0);
    const nodeRef = useRef(null);
    const explnRef = useCallback(node => {
        if (node !== null) {
            nodeRef.current = node;
            nodeHeight.current = node.clientHeight;
            gsap.set(node, {
                height: 0,
                opacity: 0,
            });
        }
    }, []);

    useEffect(() => {
        const explnNode = nodeRef.current;
        if (explnNode === null) {
            return;
        }
        gsap.to(explnNode, {
            height: showExplanation ? `${nodeHeight.current}px` : 0,
            opacity: showExplanation ? 1 : 0,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }, [showExplanation]);

    return (
        <FeedbackPaper elevation={0} variant="outlined">
            <b>
                {
                    correct ?
                    <PositiveFeedback/>
                    : <NegativeFeedback solution={ solution } />
                }
            </b>
            {
                explanation ?
                <>
                    <div ref={explnRef}>
                        { explanation }
                    </div>
                    <Button onClick={() => setShowExplanation(prev => !prev)}>
                        { showExplanation ?
                          "Verberg uitleg"
                          : "Toon uitleg" }
                    </Button>
                </>
                :
                null
            }
        </FeedbackPaper>
    );
}
