import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import LessonContext from "../../contexts/lessonContext";
import BareLessonContext from "contexts/bareLessonContext";
import AnimationContext from "./animationContext";
import ticks from "utils/ticks";

import { getColor } from "../../colors";
import useArrayRef from "hooks/useArrayRef";


const useStyles = makeStyles({
    drawing: {
        display: "block",
        margin: "auto",
        breakInside: "avoid",
        borderRadius: ".5rem",
    },
    watermark: {
        fill: getColor("gray"),
        fontSize: 11,
    },
    wrapper: {
        position: "relative",
        width: "100%",
    },
    overlay: {
        position: "absolute",
        top: "0px",
        right: "0px",
        display: "flex",
        flexDirection: "column",
    },
    overlayElement: {
        opacity: 0,
        padding: 0,
        position: "relative",
    },
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
    left=0, bottom=0, right=100, top=100, noWatermark=false, className=""
}) => {
    // A Drawing takes the width of its parent, limited to maxWidth pixels. Its
    // height is calculated from the width and the aspect ratio. If the aspect
    // ratio is null, it will be set equal to abs(right - left)/abs(top - bottom)
    const [tl, setTl] = useState(() => gsap.timeline({paused: true}));
    const [overlayRefs, setOverlayRef] = useArrayRef();
    const fileNrRef = useRef(0);
    const drawingRef = useRef(null);
    const classes = useStyles();
    const [isHovering, setIsHovering] = useState(false);
    const [parentSize, setParentSize] = useState({
        width: 0,
        height: 0,
    });
    const parentRef = React.useRef(null);
    const isAnimatingButtonsRef = React.useRef(false);
    const insideBare = useContext(BareLessonContext) !== null;

    const lessonContext = useContext(LessonContext);

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

    aspect = aspect === null ? Math.abs(right - left) / Math.abs(top - bottom) : aspect;

    const width = Math.min(parentSize.width, maxWidth);
    const height = width/aspect;
    const xScale = scaleLinear({
        range: [width*margin, width*(1 - margin)],
        domain: [left, right],
    });

    const yScale = scaleLinear({
        range: [height*(1 - margin), height*margin],
        domain: [bottom, top],
    });

    const smoothPlay = () => gsap.to(tl, {timeScale: 1, onStart: () => tl.play(), ease: "power1.out"});
    const smoothPause = () => gsap.to(tl, {timeScale: 0, onComplete: () => tl.pause(), ease: "power1.out"});
    const smoothRestart = () => gsap.to(tl, {time: 0, duration: 2, onComplete: () => tl.play(), ease: "power2.inOut"});

    React.useEffect(() => {
        if (insideBare) {
            // No animations in bare version of lesson
            // Jump to second 10 of animation
            tl.play(10);
            gsap.delayedCall(0.01, () => tl.pause());
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        tl.timeScale(0);
        ScrollTrigger.create({
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
    }, []);

    useEffect(() => {
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            setParentSize({width: rect.width, height: rect.height});
        }
    }, []);

    const drawingChild = React.useMemo(() => (
        <svg width={width} height={height} ref={drawingRef} className={`${classes.drawing} drawing ${className}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            { children }
            { noWatermark ?
            null :
            <text x={width - 10} y={height - 10} textAnchor="end" className={classes.watermark}>
            Meer op: https://hoezithet.nu
            </text>
            }
        </svg>
    ), [children, noWatermark, width, height, classes.drawing, className]);

    return (
        <div ref={parentRef} className={classes.wrapper} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <AnimationContext.Provider value={{addAnimation: addAnimation}}>
                <DrawingContext.Provider value={{width: width, height: height, xScale: xScale, yScale: yScale, ref: drawingRef}}>
                    { drawingChild }
                </DrawingContext.Provider>
            </AnimationContext.Provider>
            <div className={classes.overlay}>
                { tl.getChildren().length > 0 ?
                    <>
                        <IconButton ref={setOverlayRef} onClick={smoothPlay} aria-label="play" className={classes.overlayElement} title="Speel animatie af">
                            <PlayArrowIcon />
                        </IconButton>
                        <IconButton ref={setOverlayRef} onClick={smoothPause} aria-label="pause" className={classes.overlayElement} title="Pauzeer animatie">
                            <PauseIcon />
                        </IconButton>
                        <IconButton ref={setOverlayRef} onClick={smoothRestart} aria-label="restart" className={classes.overlayElement} title="Herstart animatie">
                            <ReplayIcon />
                        </IconButton>
                    </>
                :
                <IconButton ref={setOverlayRef} href={fileHref} download aria-label="save" className={classes.overlayElement} title="Afbeelding opslaan">
                    <SaveIcon />
                </IconButton> }
            </div>
        </div>
    );
};
