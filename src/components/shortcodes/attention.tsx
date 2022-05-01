import React from "react";
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import COLORS from "../../colors";
import md2react from "../../utils/md2react";

const Frame = styled(Box)`
    border-radius: .5rem;
    border-style: solid;
    border-color: ${COLORS.GRAY};
    margin: 1rem 0;
    break-inside: avoid;
    break-before: avoid;
`

const TitleBox = styled(Box)`
    background-color: ${COLORS.GRAY};
    color: ${COLORS.NEAR_WHITE};
    padding: .5rem;
    font-size: 1.2rem;
    font-weight: bold;
    & > p {
        margin: 0;
    }
`

const ContentBox = styled(Box)`
    padding: 1rem;
`

interface AttentionProps {
    children: React.ReactNode;
    title: string;
}

const Attention = ({ children, title }: AttentionProps) => (
    <Frame>
        <TitleBox>
            { md2react(title) }
        </TitleBox>
        <ContentBox>
            { children }
        </ContentBox>
    </Frame>
);

export { Attention };
