import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import LessonContext from "../../contexts/lessonContext";
import { Text } from '@visx/text';

import { getColor } from "../../colors";


const useStyles = makeStyles({
    drawing: {
        display: "block",
        margin: "auto"
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
    const [anims, setAnims] = useState([]);
    const [tl, setTl] = useState(() => gsap.timeline());
    const fileNrRef = useRef(0);
    const drawingRef = useRef(null);
    const classes = useStyles();

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

    const onHoverIn = () => {
        gsap.to(`.${classes.overlayElement}`, {
            right: "0px",
            opacity: 1,
            stagger: 0.15,
        });
    };
    const onHoverOut = () => {
        gsap.to(`.${classes.overlayElement}`, {
            right: "-24px",
            opacity: 0
        });
    };

    function addAnimation(child, position="+=0") {
        setAnims((prevAnims) => [...prevAnims, child]);
        tl.add(child, position);
    };

    React.useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: drawingRef.current,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    tl.play();
                } else {
                    tl.pause();
                }
            },
        });
    }, []);

    const hasAnimations = anims.length > 0;
    aspect = aspect === null ? Math.abs(xMax - xMin) / Math.abs(yMax - yMin) : aspect;

    return (
        <ParentSize>
        { ({width}) => {
            width = Math.min(width, maxWidth);
            const height = width/aspect;
            const xScale = scaleLinear({
                range: [width*left, width*(1 - right)],
                domain: [xMin, xMax],
                round: false
            });

            const yScale = scaleLinear({
                range: [height*(1 - bottom), height*top],
                domain: [yMin, yMax],
                round: false
            });

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
                <div className={classes.wrapper} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
                    <DrawingContext.Provider value={{width: width, height: height, xScale: xScale, yScale: yScale, ref: drawingRef, addAnimation: addAnimation}}>
                        { drawingChild }
                    </DrawingContext.Provider>
                    <div className={classes.overlay}>
                        { hasAnimations ?
                            <>
                                <IconButton onClick={() => tl.play()} aria-label="play" className={classes.overlayElement} title="Speel animatie af">
                                    <PlayArrowIcon />
                                </IconButton>
                                <IconButton onClick={() => tl.pause()} aria-label="pause" className={classes.overlayElement} title="Pauzeer animatie">
                                    <PauseIcon />
                                </IconButton>
                            </>
                        : null }
                        <IconButton href={fileHref} download aria-label="save" className={classes.overlayElement} title="Afbeelding opslaan">
                            <SaveIcon />
                        </IconButton>
                    </div>
                </div>
            );
          }
        }
        </ParentSize>
    );
};
