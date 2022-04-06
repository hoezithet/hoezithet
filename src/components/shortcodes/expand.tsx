import React from "react";
import styled from 'styled-components';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import COLORS from "../../colors";
import md2react from "../../utils/md2react";

interface ExpandProps {
    children: JSX.Element;
    title: string;
}

const ExpandFrame = styled(Accordion)`
    border-style: solid;
    border-color: ${COLORS.GRAY};
    border-radius: 10px;
    background-color: ${COLORS.NEAR_WHITE};
    margin: 10px 0px;
    break-inside: avoid;
`

const StyledAccSummary = styled(AccordionSummary)`
    font-weight: bold;
    color: ${COLORS.DARK_GRAY};
    & p {
        display: inline;
        margin: 0;
    }
`

const ExpandIcon = styled(ExpandMoreIcon)`
    color: ${COLORS.DARK_GRAY};
`

const StyledAccDetails = styled(AccordionDetails)`
    display: block;
`

function ExpandTitle({ title, expandIcon }: { title: string, expandIcon: JSX.Element}) {
    return (
        <StyledAccSummary expandIcon={expandIcon}>
        { md2react(title) }
		</StyledAccSummary>
    );
}

function ExpandBody({ children }: { children: JSX.Element }) {
    return (
        <StyledAccDetails>
			{ children }
		</StyledAccDetails>
    );
}

const Expand = ({ children, title }: ExpandProps) => (
	<ExpandFrame>
	    <ExpandTitle title={ title } expandIcon={<ExpandIcon/>} />
	    <ExpandBody>
	        { children }
	    </ExpandBody> 
	</ExpandFrame>
);

const ExpandBare = ({ children, title }: ExpandProps) => (
    <ExpandFrame expanded={ true } >
	    <ExpandTitle title={ title } expandIcon={ null } />
	    <ExpandBody>
	        { children }
	    </ExpandBody> 
	</ExpandFrame>
);

export { Expand, ExpandBare };