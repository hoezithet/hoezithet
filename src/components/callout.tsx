import React from "react";

import styled from "styled-components";
import COLORS, {getColor} from "colors";


const Frame = styled.div`
    background-color: ${props => getColor(props.color, 0.1)};
    color: inherit;
    margin: 1rem 0;
    padding: 0.75rem;
    break-inside: avoid;
    break-before: avoid;
    border-radius: .5rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
`
const TEXT_ICON_PAD = "1.75rem";
const TITLE_FONT_SIZE = "1.2rem";

const TitleBox = styled.div`
    color: ${props => getColor(props.color)};
    font-size: ${TITLE_FONT_SIZE};
    font-weight: bold;
    & > p {
        margin: 0;
    }
`

const TitleIcon = styled.span`
    float: left;
`;

const TitleText = styled.span`
    display: block;
    padding-left: ${props => props.hasIcon ? TEXT_ICON_PAD : "0"};
    & > p {
        margin: 0;
    }
`;

const BodyText = styled.div`
    padding-left: ${props => props.hasIcon ? TEXT_ICON_PAD : "0"};
    margin-top: calc(${props => !props.hasTitle && props.hasIcon ? TITLE_FONT_SIZE : 0}*0.3);
    padding-top: ${props => props.hasTitle ? "1em" : 0};
    & > p {
        margin: 0;
    }
`;

const ICONS = {
    "💡": "INFO",
    "⚠️": "WARN",
};

const ICON_COLORS = {
    INFO: "gold",
    WARN: "red",
};

const splitIconTitleBody = (props) => {
    let [title, body, icon] = [null, null, null];

    if (Array.isArray(props.children)) {
        title = props.children[0];
        body = props.children.slice(1);
    } else {
        title = props.children;
    }

    if (title?.props?.children?.length > 1) {
        let titleWithIcon = title.props.children;
        let iconChars = titleWithIcon.slice(0, 2);
        if (Object.keys(ICONS).includes(iconChars)) {
            icon = iconChars;
            title = titleWithIcon.slice(2);
        } else if (titleWithIcon[0].length > 1) {
            titleWithIcon = titleWithIcon[0];
            iconChars = titleWithIcon.slice(0, 2);
            if (Object.keys(ICONS).includes(iconChars)) {
                icon = iconChars;
                title = [...titleWithIcon.slice(2),
                         ...title.props.children.slice(1)];
            } else {
                icon = null;
            }
        } else {
            icon = null;
        }
    } else {
        icon = null;
    }

    if (title !== null && body === null && icon === null) {
        body = title;
        title = null;
    }

    if (title?.length === 0) {
        title = null;
    }

    return [icon, title, body];
};



const Callout = (props) => {
    const [icon, title, body] = splitIconTitleBody(props);
    const iconType = ICONS[icon];
    const color = ICON_COLORS[iconType] || "gray";
    return (
        <Frame color={color}>
            { (title !== null || icon !== null)
              ? <TitleBox color={color}>
                    <TitleIcon>{ icon }</TitleIcon>
                    <TitleText hasIcon={icon !== null}>{ title }</TitleText>
                </TitleBox>
              : null }
            <BodyText hasIcon={icon !== null} hasTitle={title !== null}>{ body }</BodyText>
        </Frame>
    );
};

export default Callout;
