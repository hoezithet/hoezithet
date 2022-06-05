import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from "styled-components";
import { gsap } from "gsap";

import { theme } from "../theme";
import { getRandomArrElement } from "../../utils/array";

interface ExercisesFeedbackProps {
    nCorrect: number;
    nTotal: number;
};

const ExercisesFeedbackImg = styled.img`
    border-radius: ${theme.spacing(1)}px;
`;

export const ExercisesFeedback = ({ nCorrect, nTotal }: ExercisesFeedbackProps) => {
    const [gifSrc, setGifSrc] = useState<string>("");
    const [gifHeight, setGifHeight] = useState<number>(0);
    const imgRefNode = useRef(null);
    const imgRefCallback = useCallback((node) => {
        if (node) {
            imgRefNode.current = node;
            gsap.set(node,
                {
                    width: "200px", // Giphy GIFs with fixed_width will have width of 200px
                    height: "200px", // Set same as width, will be animated to correct value
                    opacity: 0
                }
            );
        }
    }, []);

    const [query, message] = useMemo(() => {
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
        return [query, message];
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
                    setGifHeight(fixed_width.height);
                }
            });
        return () => { isMounted = false };
    }, []);

    const handleGifLoad = () => {
        if (!imgRefNode.current) {
            return;
        }
        gsap.to(imgRefNode.current,
            {
                height: `${gifHeight}px`,
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut"
            });
    };

    return (
        <>
            <p>Je behaalde:</p>
            <h3>{`${nCorrect}/${nTotal}`}</h3>
            <p>{message}</p>
            <ExercisesFeedbackImg ref={imgRefCallback} src={gifSrc} onLoad={handleGifLoad} />
        </>
    );
};
