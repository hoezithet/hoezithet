import React, { useContext } from 'react';
import { hexToRGB, getColor } from "../../colors";
import { makeStyles } from '@material-ui/core/styles';

import { theme } from "../theme";
import { DrawingContext } from "./drawing";
import Markdown from "../markdown";


const useStylesNote = makeStyles({
    divNoteChild: {
        '& p': {
            margin: "0",  // Remove paragraph margin
        },
        backgroundColor: props => props.showBackground ? props.backgroundColor : "none",
        borderRadius: props => props.showBackground ? `${theme.spacing(0.5)}px` : "0",
        padding: props => props.showBackground ? `${theme.spacing(1)}px` : "0",
    }
});

export const SvgNote = ({x, y, width=null, height=null, backgroundColor="light_gray", backgroundOpacity=1, showBackground=false, hAlign="center",
    vAlign="center", useContextScale=true, className="", children}) => {
    const ctx = useContext(DrawingContext);
    const {xScale, yScale} = ctx;

    if (xScale && yScale && useContextScale) {
        x = xScale(x);
        y = yScale(y);

        if (width !== null) {
            width = xScale(width) - xScale(0);
        }
        if (height !== null) {
            height = yScale(0) - yScale(height);
        }
    }

    width = width || ctx?.width;
    height = height || ctx?.height;

    const [justifyContent, alignItems] = [
        hAlign === "right" ? 
        "flex-end"  // Right
        : (
            hAlign === "left" ?
            "flex-start"  // Left
            : "center"
        ),
        vAlign === "bottom" ? 
        "flex-end"  // Bottom
        : (
            vAlign === "top" ?
            "flex-start"  // Top
            : "center"
        ),
    ];

    [x, y] = [
        hAlign === "center" ?
        x - width/2
        : (
            hAlign === "right" ?
            x - width
            : x
        ),
        vAlign === "center" ?
        y - height/2
        : (
            vAlign === "bottom" ?
            y - height
            : y
        ),
    ];


    backgroundColor = getColor(backgroundColor);
    backgroundColor = hexToRGB(backgroundColor, backgroundOpacity);

    const classes = useStylesNote({
        justifyContent: justifyContent, alignItems: alignItems,
        backgroundColor: backgroundColor,
        backgroundOpacity: backgroundOpacity,
        showBackground: showBackground
    }); 

    const divParentStyle = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: alignItems,
        justifyContent: justifyContent,
        textAlign: hAlign,
    };

    return (
        <foreignObject x={x} y={y} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={divParentStyle}>
                <div className={`${classes.divNoteChild} ${className}`}>
                    <Markdown>
                        { children }
                    </Markdown>
                </div>
            </div>
        </foreignObject>
    );
}
