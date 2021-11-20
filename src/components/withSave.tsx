import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { gsap } from "gsap";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Link, IconButton } from 'gatsby-theme-material-ui';

import LessonContext from "../contexts/lessonContext";
import { getColor } from "../colors";


const useStyles = makeStyles({
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
        color: getColor("light_gray"),
        '&:hover': {
            color: getColor("gray")
        }
    },
});

const withSave = (Component, fileExtension) => {
    return (props) => {
        const fileNrRef = useRef(0);
        const overlayElRef = useRef(null);
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
        const fileHref = `./${filename}${fileExtension}`;  // The file should be generated on deploy!
        const classes = useStyles();

        const onHoverIn = () => {
            gsap.to(overlayElRef.current, {
                right: "0px",
                opacity: 1,
            });
        };
        const onHoverOut = () => {
            gsap.to(overlayElRef.current, {
                right: "-24px",
                opacity: 0
            });
        };

        return (
            <div className={classes.wrapper} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
                <Component {...props} />
                <div className={classes.overlay}>
                    <Link aria-label="save" to={fileHref} className={classes.overlayElement} ref={overlayElRef} title="Afbeelding opslaan" download>
                        <SaveIcon />
                    </Link>
                </div>
            </div>
        );
    };
};

export default withSave;
