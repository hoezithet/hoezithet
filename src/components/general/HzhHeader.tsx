import React from "react";
import { Header } from "semantic-ui-react";
import CSS from "csstype";
import COLORS from "../../colors";

interface HzhHeaderProps {
    as?: string;
    children: React.ReactNode;
    style?: CSS.properties;
}

const hzhHeaderStyles: CSS.Properties = {
    color: COLORS.MID_GRAY,
    fontFamily: "Quicksand",
};

const HzhHeader = ({ as = "h2", style = hzhHeaderStyles, children }: HzhHeaderProps) => (
    <Header as={as} style={style}>
        {children}
    </Header>
);
export default HzhHeader;
