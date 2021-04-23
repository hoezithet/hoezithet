import React from "react";
import COLORS from "../../colors";
import styled from "styled-components";
import { makeStyles, Theme } from '@material-ui/core/styles';

interface ColorProps {
    children: JSX.Element;
    color: string;
}

type ColorSpanProps = {
    colorValue: string
};

const useStyles = makeStyles<Theme, ColorSpanProps>({
    colorSpan: {
        color: props => props.colorValue
    }
});

const Color = ({ color, children }: ColorProps) => {
    const colorName = color.toUpperCase();
    const colorValue = colorName in COLORS ? COLORS[colorName] : COLORS.BLACK;
    const classes = useStyles({colorValue: colorValue});
    return (
    <span className={classes.colorSpan}>
        { children }
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
