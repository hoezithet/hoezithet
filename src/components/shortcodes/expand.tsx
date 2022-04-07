import React from "react";
import styled from 'styled-components';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import COLORS from "../../colors";
import md2react from "../../utils/md2react";
import BareLessonContext from "contexts/bareLessonContext";

import _ from "lodash";


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

const Frame = styled.div`
    border-style: solid;
    border-color: ${COLORS.GRAY};
    border-radius: 10px;
    background-color: ${COLORS.NEAR_WHITE};
    margin: 1em 0px;
    padding: 1em;
    break-inside: avoid;
    color: ${COLORS.GRAY};
    & p {
        display: inline;
        margin: 0;
    }
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
        { title }
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

const Expand = ({ children, title }: ExpandProps) => {
    const bareContext = React.useContext(BareLessonContext);
    const insideBare = bareContext !== null;
    const [appendixIdx, setAppendixIdx] = React.useState(-1);
    const [expId] = React.useState(() => _.uniqueId("expand_"));
    const [appendixId] = React.useState(() => _.uniqueId("appendix_"));
    title = md2react(title);

    const expandComp = (
        <ExpandFrame expanded={ insideBare }>
	        <ExpandTitle title={ title } expandIcon={insideBare ? null : <ExpandIcon/>} />
	        <ExpandBody>
	            { children }
	        </ExpandBody>
	    </ExpandFrame>
    );

    const idxToHtmlId = idx => `appendix_${idx}`;

    React.useEffect(() => {
        if (insideBare) {
            const {setAppendixItems} = bareContext;
            setAppendixItems((prevItems) => {
                const idx = prevItems.length + 1;
                setAppendixIdx(idx);
                return [
                   ...prevItems,
                   {
                       appendixId: appendixId,
                       idx: idx,
                       title: title,
                       children: children,
                       expandId: expId,
                   }
                ];
            });
        }
    }, []);

    return (
        insideBare ?
        <Frame id={expId}>
	        Zie <a href={`#${appendixId}`}>appendix {appendixIdx}: "{title}"</a>
	    </Frame>
	    :
	    expandComp
    );
};

export { Expand };
