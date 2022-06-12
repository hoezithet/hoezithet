import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from "styled-components";
import { gsap } from "gsap";

import { theme } from "../theme";
import { getRandomArrElement } from "../../utils/array";
import useExpandable from "hooks/useExpandable";

interface ExercisesFeedbackProps {
    nCorrect: number;
    nTotal: number;
};

const ExercisesFeedbackImg = styled.img`
    border-radius: ${theme.spacing(1)};
`;

export const ExercisesFeedback = ({ nCorrect, nTotal }: ExercisesFeedbackProps) => {
    const [gifSrc, setGifSrc] = useState<string>("");
    const [gifHeight, setGifHeight] = useState<number>(0);
    const [bodyRef, wrapperRef, isExpanded, setIsExpanded] = useExpandable();

    const [query, setQuery] = useState<string|null>(null);
    const [message, setMessage] = useState<string|null>(null);

    React.useEffect(() => {
        let query, message;
        const pct = nCorrect / nTotal;
        if (pct === 1.0) {
            query = getRandomArrElement(["party", "excited", "dance", "hooray", "proud"]);
            message = getRandomArrElement(["Proficiat!", "Mooi zo!", "Perfect!", "Hoera! Alles juist!", "Super goed!"]);
            const partyEmojis = [
                "🎉", "🎈", "🎊", "🥳", "👏", "🕺", "💃"
            ];
            const emoji1 = getRandomArrElement(partyEmojis);
            const emoji2 = getRandomArrElement(partyEmojis.filter(e => e !== emoji1));
            message = `${emoji1}${emoji2} ${message} ${emoji2}${emoji1}`
        } else if (pct >= 0.6) {
            query = getRandomArrElement(["good job", "well done"]);
            message = getRandomArrElement(["Zeker niet slecht!", "Kan ermee door!"]);
        } else {
            query = getRandomArrElement(["darn"]);
            message = getRandomArrElement(["Helaas toch enkele foutjes...", "Jammer!", "Volgende keer beter!"]);
        }

        setQuery(query);
        setMessage(message);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const offset = Math.floor(Math.random() * Math.floor(20));
        const url = `${process.env.GATSBY_GIPHY_API_URL}?api_key=${process.env.GATSBY_GIPHY_API_KEY}&q=${query}&limit=1&offset=${offset}&rating=g&lang=en`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return null;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (!(data && data.data && data.data[0] && data.data[0].images)) {
                    return;
                }
                const { fixed_width } = data.data[0].images;
                if (isMounted) {
                    setGifSrc(fixed_width.url);
                }
            });
        return () => { isMounted = false };
    }, [query]);

    return (
        <>
            <p>Je behaalde:</p>
            <h3>{`${nCorrect}/${nTotal}`}</h3>
            <p>{message}</p>
            <div ref={wrapperRef} style={{overflow: "hidden"}}>
                <div ref={bodyRef}>
                    <ExercisesFeedbackImg src={gifSrc} onLoad={() => setIsExpanded(true)} />
                </div>
            </div>
        </>
    );
};
