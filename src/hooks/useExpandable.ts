import React from "react";
import { gsap } from 'gsap';

const useExpandable = (defaultExpanded=false, onStart=(isExpanded) => {}) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    const bodyRef = React.useRef(null);
    const iconRef = React.useRef(null);
    const wrapperRef = React.useRef(null);
    const [tl] = React.useState(() => gsap.timeline());

    const getBodySize = () => bodyRef.current ? bodyRef.current.offsetHeight : 0;

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
            onStart: () => onStart(isExpanded),
        });
    }, [isExpanded]);
    
    return [bodyRef, wrapperRef, isExpanded, setIsExpanded];
};


export default useExpandable;
