import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import LessonContext from "../../contexts/lessonContext";
import { Text } from '@visx/text';
import BareLessonContext from "contexts/bareLessonContext";

import { getColor } from "../../colors";
import useArrayRef from "hooks/useArrayRef";


const useStyles = makeStyles({
    drawing: {
        display: "block",
        margin: "auto",
        breakInside: "avoid",
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

export const DrawingContext = createContext({
    width: null,
    height: null,
    xScale: null,
    yScale: null,
    ref: null,
    addAnimation: (child, position) => {},
});

export const Drawing = ({
    children=null, aspect=null, maxWidth=500, top=0.05, right=0.05, bottom=0.05, left=0.05,
    xMin=0, yMin=0, xMax=100, yMax=100, noWatermark=false, className=""
}) => {
    // A Drawing takes the width of its parent, limited to maxWidth pixels. Its
    // height is calculated from the width and the aspect ratio. If the aspect
    // ratio is null, it will be set equal to abs(xMax - xMin)/abs(yMax - yMin)
    const [tl, setTl] = useState(() => gsap.timeline({paused: true}));
    const [overlayRefs, setOverlayRef] = useArrayRef();
    const fileNrRef = useRef(0);
    const drawingRef = useRef(null);
    const classes = useStyles();
    const [isHovering, setIsHovering] = useState(false);
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

    aspect = aspect === null ? Math.abs(xMax - xMin) / Math.abs(yMax - yMin) : aspect;

    return (
        <ParentSize>
        { ({width}) => {
            width = Math.min(width, maxWidth);
            const height = width/aspect;
            const getScaledMetric = scale => x => Math.abs(scale(x) - scale(0));
            const xScale = scaleLinear({
                range: [width*left, width*(1 - right)],
                domain: [xMin, xMax],
                round: false
            });
            xScale.metric = getScaledMetric(xScale);

            const yScale = scaleLinear({
                range: [height*(1 - bottom), height*top],
                domain: [yMin, yMax],
                round: false
            });
            yScale.metric = getScaledMetric(yScale);

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
            }, [width]);

            const drawingChild = React.useMemo(() => (
                <svg width={width} height={height} ref={drawingRef} className={`${classes.drawing} drawing ${className}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    { children }
                    { noWatermark ?
                    null :
                    <Text x={width - 10} y={height - 10} textAnchor="end" className={classes.watermark}>
                    Meer op: https://hoezithet.nu
                    </Text>
                    }
                </svg>
            ), [children, noWatermark, width, height, classes.drawing, className]);

            return (
                <div className={classes.wrapper} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                    <DrawingContext.Provider value={{width: width, height: height, xScale: xScale, yScale: yScale, ref: drawingRef, addAnimation: addAnimation}}>
                        { drawingChild }
                    </DrawingContext.Provider>
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
          }
        }
        </ParentSize>
    );
};
