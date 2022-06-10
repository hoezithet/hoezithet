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
        borderRadius: props => props.borderRadius,
        padding: props => props.textPadding,
        color: props => props.color,
    }
});


export type AnnotProps = {
    x: number,
    y: number,
    width?: number,
    height?: number,
    backgroundColor?: string,
    backgroundOpacity?: number,
    showBackground?: boolean,
    align?: string,
    className?: string,
    fontSize?: string|number,
    color?: string,
    textPadding?: string|number,
    borderRadius?: string|number,
    parentPadding?: string|number,
    onComplete: () => void,
    children: string
};


export const Annot = ({
    x=0, y=0, width=null, height=null,
    backgroundColor="white", backgroundOpacity=1,
    showBackground=false, align="center center",
    className="",
    fontSize="inherit", color="inherit",
    textPadding=null, borderRadius=null,
    parentPadding=null,
    onComplete=() => {},
    children
}: AnnotProps) => {
    [textPadding, borderRadius, parentPadding] = (
        showBackground ?
        [textPadding || ".5em", borderRadius || ".25em", parentPadding || ".25em"]
        : [textPadding || "0", borderRadius || "0", parentPadding || "0"]
    );
    const ctx = useContext(DrawingContext);

    backgroundOpacity = showBackground ? backgroundOpacity : .0;

    width = width || ctx?.width;
    height = height || ctx?.height;

    const [vAlign, hAlign] = align.split(" ");
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


    backgroundColor = getColor(backgroundColor, backgroundOpacity);

    const classes = useStylesNote({
        justifyContent: justifyContent, alignItems: alignItems,
        backgroundColor: backgroundColor,
        color: color,
        borderRadius: borderRadius,
        textPadding: textPadding,
    }); 

    const divParentStyle = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: alignItems,
        justifyContent: justifyContent,
        textAlign: hAlign,
        padding: parentPadding,
    };
    const divChildStyle = {
        fontSize: fontSize,
    };

    return (
        <foreignObject x={x} y={y} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={divParentStyle}>
                <div className={`${classes.divNoteChild} ${className}`} style={divChildStyle}>
                    <Markdown onComplete={onComplete}>{ children }</Markdown>
                </div>
            </div>
        </foreignObject>
    );
}
