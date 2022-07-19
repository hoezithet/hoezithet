import React from "react";
import { styled } from '@mui/system';
import COLORS from '../colors';
import Box from '@mui/material/Box';

const TocTitle = styled('p')({
    fontWeight: 'bold',
})

const TocFrame = styled(Box)({
    margin: '20px 0px',
    color: COLORS.GRAY,
})

const TocLink = styled('a')({
    textDecoration: 'none',
    color: COLORS.GRAY,
})

interface TocItems {
    children: { items: {url: string; title: string}[] };
}

const Toc = ({ children }: TocItems) => (
    children.items ?
    <TocFrame>
        <TocTitle>
            Inhoud
        </TocTitle>
        <ul>{ children.items.map((item) => <li key={ item.title }><TocLink href={item.url}>{item.title}</TocLink></li>) }</ul>
    </TocFrame>
    : null
);

export default Toc ;
