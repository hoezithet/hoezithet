import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { styled } from '@mui/system';

import SaveIcon from '@mui/icons-material/Save';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import LessonContext from "../../contexts/lessonContext";
import BareLessonContext from "contexts/bareLessonContext";
import AnimationContext from "./animationContext";
import ticks from "utils/ticks";

import { getColor } from "../../colors";
import useArrayRef from "hooks/useArrayRef";


const DrawingSvg = styled('svg')({
    display: 'block',
    margin: 'auto',
    breakInside: 'avoid',
    borderRadius: '.5rem',
    fontFamily: 'Quicksand,sans-serif',
});

const WatermarkText = styled('text')({
    fill: getColor("gray"),
    fontSize: 11,
});

const DrawingWrapper = styled('div')({
    position: 'relative',
    width: '100%',
});

const DrawingOverlay = styled('div')({
    position: 'absolute',
    top: '0px',
    right: '0px',
    display: 'flex',
    flexDirection: 'column',
});

const OverlayElement = styled(IconButton)({
    opacity: 0,
    padding: 0,
    position: 'relative',
});

const scaleLinear = ({range, domain}) => {
    const m = (range[1] - range[0])/(domain[1] - domain[0]);
    const q = range[0] - m * domain[0];
    const scale = x => m*x + q;
    scale.inverse = y => (y - q)/m;
    scale.domain = () => domain;
    scale.range = () => range;
    scale.metric = x => Math.abs(scale(x) - scale(0));
    scale.ticks = (count) => {
        const d = domain;
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };
    return scale;
};

export const DrawingContext = createContext({
    width: null,
    height: null,
    xScale: null,
    yScale: null,
    ref: null,
});


export const Drawing = ({
    children=null, aspect=null, maxWidth=500, margin=.0,
    left=0, bottom=0, right=100, top=100, noWatermark=false
}) => {
    // A Drawing takes the width of its parent, limited to maxWidth pixels. Its
    // height is calculated from the width and the aspect ratio. If the aspect
    // ratio is null, it will be set equal to abs(right - left)/abs(top - bottom)
    const [tl, setTl] = useState(() => gsap.timeline({paused: true}));
    const [overlayRefs, setOverlayRef] = useArrayRef();
    const fileNrRef = useRef(0);
    const drawingRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const parentRef = React.useRef(null);
    const isAnimatingButtonsRef = React.useRef(false);
    const insideBare = useContext(BareLessonContext) !== null;
    const containsAnimation = tl.getChildren().length > 0;

    const lessonContext = useContext(LessonContext);

    aspect = aspect === null ? Math.abs(right - left) / Math.abs(top - bottom) : aspect;
    const [parentSize, setParentSize] = useState({
        width: maxWidth,
        height: maxWidth/aspect,
    });

    if (lessonContext && fileNrRef.current === 0) {
        lessonContext.fileCount = (
            lessonContext.fileCount
            ? lessonContext.fileCount + 1
            : 1
        );
        fileNrRef.current = lessonContext.fileCount;
    }

    const filename = `${lessonContext?.slug?.split('/').slice(2, -1).join('_')}-${fileNrRef.current}`;
    const fileHref = `./${filename}.png`;  // The file should be generated on deploy!

    const showButtons = () => {
        gsap.to(overlayRefs.current, {
            right: "12px",
            opacity: 1,
            stagger: 0.15,
            onStart: () => {
                isAnimatingButtonsRef.current = true;
            },
            onComplete: () => {
                isAnimatingButtonsRef.current = false;
            },
        });
    };
    const hideButtons = () => {
        gsap.to(overlayRefs.current, {
            right: "-36px",
            opacity: 0,
            onStart: () => {
                isAnimatingButtonsRef.current = true;
            },
            onComplete: () => {
                isAnimatingButtonsRef.current = false;
            },
        });
    };

    React.useEffect(() => {
        if (isAnimatingButtonsRef.current) {
            return;
        }
        if (isHovering) {
            showButtons();
        } else {
            hideButtons();
        }
    }, [isHovering]);

    function addAnimation(child, position="+=0") {
        tl.add(child, position);
    };

    const width = Math.min(parentSize.width, maxWidth);
    const height = width/aspect;

    const xScale = scaleLinear({
        range: [maxWidth*margin, maxWidth*(1 - margin)],
        domain: [left, right],
    });

    const maxHeight = maxWidth/aspect;
    const yScale = scaleLinear({
        range: [maxHeight*(1 - margin), maxHeight*margin],
        domain: [bottom, top],
    });

    const smoothPlay = () => gsap.to(tl, {timeScale: 1, onStart: () => tl.play(), ease: "power1.out"});
    const smoothPause = () => gsap.to(tl, {timeScale: 0, onComplete: () => tl.pause(), ease: "power1.out"});
    const smoothRestart = () => gsap.to(tl, {time: 0, duration: 2, onComplete: () => tl.play(), ease: "power2.inOut"});

    React.useEffect(() => {
        if (!containsAnimation) {
            return;
        }
        if (insideBare) {
            // No animations in bare version of lesson
            // Jump to second 10 of animation
            tl.play(10);
            gsap.delayedCall(0.01, () => tl.pause());
            return;
        }
        tl.timeScale(0);
        gsap.registerPlugin(ScrollTrigger);
        const scrollTrigger = ScrollTrigger.create({
            trigger: drawingRef.current,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    smoothPlay();
                } else {
                    smoothPause();
                }
            },
        });
        return () => scrollTrigger.kill();
    }, [containsAnimation]);

    useEffect(() => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            setParentSize({width: rect.width, height: rect.height});
        }
    }, []);

    return (
        <DrawingWrapper ref={parentRef} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <AnimationContext.Provider value={{addAnimation: addAnimation}}>
                <DrawingContext.Provider value={{width: maxWidth, height: maxHeight, xScale: xScale, yScale: yScale, ref: drawingRef}}>
                    <DrawingSvg width={width} height={height} ref={drawingRef} className="drawing" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${maxWidth} ${maxHeight}`}>
                        { children }
                    </DrawingSvg>
                </DrawingContext.Provider>
            </AnimationContext.Provider>
            <DrawingOverlay>
                { containsAnimation ?
                    <>
                        <OverlayElement
                            ref={setOverlayRef}
                            onClick={smoothPlay}
                            aria-label="play"
                            title="Speel animatie af"
                            size="large">
                            <PlayArrowIcon />
                        </OverlayElement>
                        <OverlayElement
                            ref={setOverlayRef}
                            onClick={smoothPause}
                            aria-label="pause"
                            title="Pauzeer animatie"
                            size="large">
                            <PauseIcon />
                        </OverlayElement>
                        <OverlayElement
                            ref={setOverlayRef}
                            onClick={smoothRestart}
                            aria-label="restart"
                            title="Herstart animatie"
                            size="large">
                            <ReplayIcon />
                        </OverlayElement>
                    </>
                :
                <OverlayElement
                    ref={setOverlayRef}
                    href={fileHref}
                    download
                    aria-label="save"
                    title="Afbeelding opslaan"
                    size="large">
                    <SaveIcon />
                </OverlayElement> }
            </DrawingOverlay>
        </DrawingWrapper>
    );
};
