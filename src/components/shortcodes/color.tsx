import React from "react";
import { getColor } from "../../colors";
import styled from "styled-components";
import { makeStyles, Theme } from '@material-ui/core/styles';
import Markdown from "../markdown";


interface ColorProps {
    children: JSX.Element;
    color: string;
}

type ColorSpanProps = {
    colorValue: string
};

const useStyles = makeStyles<Theme, ColorSpanProps>({
    colorSpan: {
        color: props => props.colorValue,
        '&>div,&>div>p': {
            display: 'inline-block',
            padding: 0,
            margin: 0,
        }
    }
});

const Color = ({ color, children }: ColorProps) => {
    const classes = useStyles({colorValue: getColor(color)});
    return (
    <span className={classes.colorSpan}>
        <Markdown>{ children }</Markdown>
    </span>
    );
}

export const Black = ({children}: ColorProps) => {
    return (
        <Color color="BLACK">
            { children }
        </Color>
    )
}

export const LightBlue = ({children}: ColorProps) => {
    return (
        <Color color="LIGHT_BLUE">
            { children }
        </Color>
    )
}

export const Blue = ({children}: ColorProps) => {
    return (
        <Color color="BLUE">
            { children }
        </Color>
    )
}

export const DarkBlue = ({children}: ColorProps) => {
    return (
        <Color color="DARK_BLUE">
            { children }
        </Color>
    )
}

export const Navy = ({children}: ColorProps) => {
    return (
        <Color color="NAVY">
            { children }
        </Color>
    )
}

export const Green = ({children}: ColorProps) => {
    return (
        <Color color="GREEN">
            { children }
        </Color>
    )
}

export const Yellow = ({children}: ColorProps) => {
    return (
        <Color color="YELLOW">
            { children }
        </Color>
    )
}

export const Gold = ({children}: ColorProps) => {
    return (
        <Color color="GOLD">
            { children }
        </Color>
    )
}

export const Orange = ({children}: ColorProps) => {
    return (
        <Color color="ORANGE">
            { children }
        </Color>
    )
}

export const Red = ({children}: ColorProps) => {
    return (
        <Color color="RED">
            { children }
        </Color>
    )
}

export const DarkRed = ({children}: ColorProps) => {
    return (
        <Color color="DARK_RED">
            { children }
        </Color>
    )
}

export const Purple = ({children}: ColorProps) => {
    return (
        <Color color="PURPLE">
            { children }
        </Color>
    )
}

export const Gray = ({children}: ColorProps) => {
    return (
        <Color color="GRAY">
            { children }
        </Color>
    )
}

export const Mute = ({children}: ColorProps) => {
    return (
        <Color color="GRAY">
            { children }
        </Color>
    )
}

export const NearWhite = ({children}: ColorProps) => {
    return (
        <Color color="NEAR_WHITE">
            { children }
        </Color>
    )
}

export default Color;
