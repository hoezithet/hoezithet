import React, { useContext } from 'react';
import { hexToRGB, getColor } from "../../colors";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { theme } from "../theme";
import { DrawingContext } from "./drawing";
import Markdown from "../markdown";
import { isNumeric } from "../../utils/number";


const useStylesNote = makeStyles({
    divNoteChild: {
        '& p': {
            margin: "0",  // Remove paragraph margin
        },
        backgroundColor: props => props.backgroundColor,
        borderRadius: props => props.showBackground ? `${theme.spacing(0.5)}px` : "0",
        padding: props => props.showBackground ? `${theme.spacing(1)}px` : "0",
        color: props => props.color,
    }
});

export const SvgNote = ({
    x=0, y=0, width=null, height=null,
    backgroundColor="white", backgroundOpacity=1,
    showBackground=false, hAlign="center",
    vAlign="center", useContextScale=true, className="",
    fontSize="inherit", color="inherit",
    children
}) => {
    const ctx = useContext(DrawingContext);
    const {xScale, yScale} = ctx;
    backgroundOpacity = showBackground ? backgroundOpacity : 0;

    if (xScale && yScale && useContextScale) {
        x = xScale(x);
        y = yScale(y);

        if (isNumeric(fontSize)) {
            fontSize = yScale(fontSize);
        }

        if (width !== null) {
            width = Math.abs(xScale(width) - xScale(0));
        }
        if (height !== null) {
            height = Math.abs(yScale(0) - yScale(height));
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
        showBackground: showBackground,
        color: color,
    }); 

    const divParentStyle = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: alignItems,
        justifyContent: justifyContent,
        textAlign: hAlign,
        padding: showBackground ? "2px" : "0",
    };
    const divChildStyle = {
        fontSize: fontSize,
    };

    const noteContents = <Markdown>{ children }</Markdown>;

    return (
        <foreignObject x={x} y={y} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={divParentStyle}>
            { showBackground ?
                <Paper className={`${classes.divNoteChild} ${className}`} elevation={1} style={divChildStyle}>
                    { noteContents }
                </Paper>
                :
                <div className={`${classes.divNoteChild} ${className}`} style={divChildStyle}>
                    { noteContents }
                </div> }
            </div>
        </foreignObject>
    );
}
