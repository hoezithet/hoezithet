import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import { gsap } from "gsap";

import { getRandomArrElement } from "utils/array";
import useExpandable from "hooks/useExpandable";
import giphyLogo from "../../../images/GiphyLogo_vert.png";

interface ExercisesFeedbackProps {
    nCorrect: number|null;
    nTotal: number;
};

const ExercisesFeedbackImg = styled('img')(({ theme }) => ({
    borderRadius: theme.spacing(1),
}));

export const ExercisesFeedback = ({ nCorrect, nTotal }: ExercisesFeedbackProps) => {
    const [gifSrc, setGifSrc] = useState<string>("");
    const [gifHeight, setGifHeight] = useState<number>(0);
    const [bodyRef, wrapperRef, isExpanded, setIsExpanded] = useExpandable();

    const [query, setQuery] = useState<string|null>(null);
    const [message, setMessage] = useState<string|null>(null);

    const pct = nCorrect !== null && nTotal !== 0 ? nCorrect / nTotal : null;  // If null: user couldn't give input, so we can't evaluate

    React.useEffect(() => {
        let query, message;
        if (pct === 1.0 || pct === null) {
            query = getRandomArrElement(["party", "excited", "dance", "hooray", "proud"]);
            const messages = pct !== null ? [
                "Proficiat!", "Mooi zo!", "Perfect!", "Hoera! Alles juist!", "Super goed!"
            ]: [
                "Helemaal klaar!", "Klaar!", "Gedaan!", "Dat was het!"
            ];
            message = getRandomArrElement(messages);
            const partyEmojis = [
                "🎉", "🎈", "🎊", "🥳", "👏", "🕺", "💃", "💪"
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
            { pct !== null ?
              <>
                <p>Je behaalde:</p>
                <h3>{`${nCorrect}/${nTotal}`}</h3>
                <p>{message}</p>
              </> : <h3>{message}</h3> }
            <div ref={wrapperRef} style={{overflow: "hidden"}}>
                <div ref={bodyRef}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ExercisesFeedbackImg src={gifSrc} onLoad={() => setIsExpanded(true)} />
                        </Grid>
                        <Grid item xs={12}>
                            <img src={giphyLogo} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
};
