import React from "react";

import { gsap } from 'gsap';
import { styled } from '@mui/system';
import _ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from 'hooks/useId';

import COLORS, {getColor} from "colors";
import BareLessonContext from "contexts/bareLessonContext";
import useExpandable from "hooks/useExpandable";


type FrameProps = {
    color: string,
};


const Frame = styled('div', {
    shouldForwardProp: (prop) => prop !== 'color'
})<FrameProps> (({
    color
}) => ({
    backgroundColor: getColor(color, 0.1),
    color: 'inherit',
    margin: '1rem 0',
    padding: '0.75rem',
    breakInside: 'avoid',
    breakBefore: 'avoid',
    borderRadius: '.5rem',
    boxShadow: '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)',
})
);

const TEXT_ICON_PAD = "1.75rem";
const TITLE_FONT_SIZE = "1.2rem";

type TitleBoxProps = {
    color: string,
    useExpand?: boolean,
}

const TitleBox = styled('div', {
    shouldForwardProp: prop => (
        prop !== 'color'
        && prop !== 'useExpand'
    )
})<TitleBoxProps> (({
    color, useExpand
}) => ({
    color: getColor(color),
    fontSize: TITLE_FONT_SIZE,
    fontWeight: 'bold',
    cursor: useExpand ? "pointer" : "auto",
    '& > p': {
        margin: 0,
    }
})
);

const TitleIcon = styled('span')({
    float: 'left',
})

const ExpandMoreIcon = styled(_ExpandMoreIcon)({
    float: 'right',
    cursor: 'pointer',
});

type TitleTextProps = {
    hasIcon?: boolean
};

const TitleText = styled('span', {
    shouldForwardProp: prop => (
        prop !== 'hasIcon'
    )
})<TitleTextProps> (({
    hasIcon
}) => ({
    display: 'block',
    paddingLeft: hasIcon ? TEXT_ICON_PAD : "0",
    '& > p': {
        margin: 0,
    }
})
);

type BodyTextProps = {
    hasIcon?: boolean,
    hasTitle?: boolean,
};

const BodyText = styled('div', {
    shouldForwardProp: prop => (
        prop !== 'hasIcon'
        && prop !== 'hasTitle'
    )
})<BodyTextProps> (({
    hasIcon, hasTitle
}) => ({
    paddingLeft: hasIcon ? TEXT_ICON_PAD : "0",
    marginTop: `calc(${!hasTitle && hasIcon ? TITLE_FONT_SIZE : 0}*0.3)`,
    paddingTop: hasTitle ? "1em" : 0,
    overflow: 'scroll',
    '& > p': {
        margin: 0,
    }
})
);

const CalloutBodyWrapper = styled('div')({
    overflow: 'scroll',
})

const ICONS = {
    "💡": "INFO",
    "⚠️": "WARN",
};

const ICON_COLORS = {
    INFO: "gold",
    WARN: "red",
};

const EXPANDED = '+';
const COLLAPSED = '-';

const splitIconTitleBodyExpanded = (props) => {
    let [title, body, icon, expanded] = [null, null, null, null];

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

    if (title?.props?.children?.length > 0 && [EXPANDED, COLLAPSED].includes(title.props.children[0])) {
        expanded = title.props.children[0] === EXPANDED;
        title = title.props.children.slice(1);
    } else if (title?.props?.children?.length > 0 && [EXPANDED, COLLAPSED].includes(title.props.children[0][0])) {
        expanded = title.props.children[0][0] === EXPANDED;
        title = [
           ...title.props.children[0].slice(1),
           ...title.props.children.slice(1),
       ];
    } else if (title?.length > 0 && [EXPANDED, COLLAPSED].includes(title[0])) {
        expanded = title[0] === EXPANDED;
        title = title.slice(1);
    }
    return [icon, title, body, expanded];
};


const useBareCallout = (title, body) => {
    const bareContext = React.useContext(BareLessonContext);
    const insideBare = bareContext !== null;
    const [appendixIdx, setAppendixIdx] = React.useState(-1);
    const expId = useId();
    const appendixId = useId();

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
                       children: body,
                       expandId: expId,
                   }
                ];
            });
        }
    }, []);

    return [insideBare, expId, appendixId, appendixIdx];
};

const Callout = (props) => {
    const [icon, title, body, expanded] = splitIconTitleBodyExpanded(props);
    const useExpand = expanded !== null;
    const iconType = ICONS[icon];
    const color = ICON_COLORS[iconType] || "gray";
    const iconRef = React.useRef(null);
    const onExpandStart = (isExpanded) => {
        if (iconRef.current !== null) {
            gsap.to(iconRef.current, {
                rotation: isExpanded ? 0 : -90,
                duration: 0.1,
            }, "<")
        }
    };
    const [bodyRef, wrapperRef, isExpanded, setIsExpanded] = useExpandable(expanded, onExpandStart);
    const [insideBare, expId, appendixId, appendixIdx] = useBareCallout(title, body);

    return (
        insideBare && useExpand ?
        <Frame id={expId} color={color}>
	        Zie <a href={`#${appendixId}`}>appendix {appendixIdx}: "{title}"</a>
	    </Frame>
	    :
        <Frame color={color}>
            { (title !== null || icon !== null)
              ? <TitleBox color={color} useExpand={useExpand} onClick={useExpand ? () => setIsExpanded(prev => !prev) : () => {}}>
                    <TitleIcon>{ icon }</TitleIcon>
                    <TitleText hasIcon={icon !== null}>
                        { title }
                        {useExpand ? <ExpandMoreIcon ref={iconRef} /> : null}
                    </TitleText>
                </TitleBox>
              : null }
              <CalloutBodyWrapper ref={useExpand ? wrapperRef : null}>
                  <BodyText ref={useExpand ? bodyRef : null} hasIcon={icon !== null} hasTitle={title !== null}>{ body }</BodyText>
              </CalloutBodyWrapper>
        </Frame>
    );
};

export default Callout;
