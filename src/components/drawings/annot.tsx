import React, { useContext } from 'react';
import { hexToRGB, getColor } from "../../colors";

import styled from 'styled-components';

import { DrawingContext } from "./drawing";
import Markdown from "../markdown";
import { isNumeric } from "../../utils/number";


const AnnotChild = styled.div`
    & p {
        margin: 0;  // Remove paragraph margin
    }
    background-color: ${props => props.backgroundColor};
    border-radius: ${props => props.borderRadius};
    padding: ${props => props.textPadding};
    color: ${props => props.color};
    font-size: ${props => props.fontSize};
`;


export type AnnotProps = {
    x: number,
    y: number,
    width?: number,
    height?: number,
    backgroundColor?: string,
    backgroundOpacity?: number,
    showBackground?: boolean,
    align?: string,
    fontSize?: string|number,
    color?: string,
    textPadding?: string|number,
    borderRadius?: string|number,
    parentPadding?: string|number,
    children: string
};


export const Annot = ({
    x=0, y=0, width=null, height=null,
    backgroundColor="white", backgroundOpacity=1,
    showBackground=false, align="center center",
    fontSize="inherit", color="inherit",
    textPadding=null, borderRadius=null,
    parentPadding=null,
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

    const divParentStyle = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: alignItems,
        justifyContent: justifyContent,
        textAlign: hAlign,
        padding: parentPadding,
    };

    return (
        <foreignObject x={x} y={y} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={divParentStyle}>
                <AnnotChild backgroundColor={backgroundColor}
                    color={color}
                    borderRadius={borderRadius}
                    textPadding={textPadding}
                    fontSize={fontSize}
                >
                    <Markdown>{ children }</Markdown>
                </AnnotChild>
            </div>
        </foreignObject>
    );
}
