import React from "react";

import COLORS, {getColor} from "colors";
import { gsap } from 'gsap';
import BareLessonContext from "contexts/bareLessonContext";
import _ from "lodash";

const _ExpandMoreIcon = () => {
    return (
        <span>
            TO DO
            <style jsx>{`
                span {
                    float: right;
                    cursor: pointer;
                }
            `}</style>
        </span>
    );
};


const Frame = ({color, children}) => {
    return (
        <div>
            {children}
            <style jsx>{`
                div {
                    background-color: ${getColor(color, 0.1)};
                }
            `}</style>
            <style jsx>{`
                div {
                    color: inherit;
                    margin: 1rem 0;
                    padding: 0.75rem;
                    break-inside: avoid;
                    break-before: avoid;
                    border-radius: .5rem;
                    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
                }
            `}</style>
        </div>
    );
};

const TEXT_ICON_PAD = "1.75rem";
const TITLE_FONT_SIZE = "1.2rem";

const TitleBox = ({color, useExpand, children}) => {
    return (
        <div>
            { children }
            <style jsx>{`
                div {
                    color: ${getColor(color)};
                    font-size: ${TITLE_FONT_SIZE};
                    font-weight: bold;
                    cursor: ${useExpand ? "pointer" : "auto"};
                }
                div > p {
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

const TitleIcon = ({ children }) => {
    return (
        <span>
            {children}
            <style jsx>{`
                span {
                    float: left;
                }
            `}</style>
        </span<
    );
};


const TitleText = ({ children, hasIcon=false }) => {
    return (
        <span>
            {children}
            <style jsx>{`
                span {
                    display: block;
                    padding-left: ${hasIcon ? TEXT_ICON_PAD : "0"};
                }
                span > p {
                    margin: 0;
                }
            `}</style>
        </span>
    );
};

const BodyText = ({ children, hasIcon=false, hasTitle=false }) => {
    return (
        <div>
            {children}
            <style jsx>{`
                div {
                    padding-left: ${hasIcon ? TEXT_ICON_PAD : "0"};
                    margin-top: calc(${!hasTitle && hasIcon ? TITLE_FONT_SIZE : 0}*0.3);
                    padding-top: ${hasTitle ? "1em" : 0};
                    overflow: scroll;
                }
                div > p {
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

const CalloutBodyWrapper = ({children}) => {
    return (
        <div>
            {children}
            <style jsx>{`
                div {
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

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
    const [expId] = React.useState(() => _.uniqueId("expand_"));
    const [appendixId] = React.useState(() => _.uniqueId("appendix_"));

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

const useExpandableBody = (defaultExpanded) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    const bodyRef = React.useRef(null);
    const iconRef = React.useRef(null);
    const wrapperRef = React.useRef(null);
    const [tl] = React.useState(() => gsap.timeline());

    const getBodySize = () => bodyRef.current ? bodyRef.current.clientHeight : 0;

    const handleClick = () => {
        setIsExpanded(prev => !prev);
    };

    React.useEffect(() => {
        if (!defaultExpanded) {
            gsap.set(wrapperRef.current, {
                height: 0,
            });
        }
    }, []);

    React.useEffect(() => {
        const bodySize = getBodySize();

        tl.to(wrapperRef.current, {
            height: isExpanded ? `${bodySize}px` : 0,
        }).to(iconRef.current, {
            rotation: isExpanded ? 0 : -90,
            duration: 0.1,
        }, "<");
    }, [isExpanded]);
    
    return [bodyRef, iconRef, wrapperRef, handleClick];
};

const Callout = (props) => {
    const [icon, title, body, expanded] = splitIconTitleBodyExpanded(props);
    const useExpand = expanded !== null;
    const iconType = ICONS[icon];
    const color = ICON_COLORS[iconType] || "gray";
    const [bodyRef, iconRef, wrapperRef, handleClick] = useExpandableBody(expanded);
    const [insideBare, expId, appendixId, appendixIdx] = useBareCallout(title, body);

    return (
        insideBare && useExpand ?
        <Frame id={expId} color={color}>
	        Zie <a href={`#${appendixId}`}>appendix {appendixIdx}: "{title}"</a>
	    </Frame>
	    :
        <Frame color={color}>
            { (title !== null || icon !== null)
              ? <TitleBox color={color} useExpand={useExpand} onClick={useExpand ? handleClick : () => {}}>
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
