import gsap from 'gsap';
import { useCallback, useEffect, useState } from 'react';

/**
 * Use gsap animation on a react component. If both fromVars and toVars are not
 * null, a "fromTo" tween will be used. If either fromVars or toVars are given,
 * a "from" tween, resp. "toTween", will be used.
 * 
 * @param tl The gsap timeline to which the animation will be added. If
 * undefined, a new timeline will be created with default parameters.
 * @param fromVars From vars.
 * @param toVars To vars.
 * @param position Position parameter passed to the timeline.
 * @returns The node ref to pass to the component you whish to animate.
 */
const useGsap = <T extends Element> (
    fromVars?: gsap.TweenVars,
    toVars?: gsap.TweenVars,
    tl?: gsap.core.Timeline,
    position?: gsap.Position
) => {
    const [node, setNode] = useState<T|null>(null);
    const nodeRef = useCallback((newNode: T|null) => {
        if (newNode !== null) {
            setNode(newNode);
        }
    }, []);

    useEffect(() => {
        if (node !== null) {
            tl = tl === undefined ? gsap.timeline() : tl;

            if (fromVars !== undefined && toVars !== undefined) {
                tl.fromTo(node, fromVars, toVars, position);
            } else if (fromVars !== undefined) {
                tl.from(node, fromVars, position);
            } else if (toVars !== undefined) {
                tl.to(node, toVars, position);
            }
        }
    }, [node]);

    return nodeRef;
};

export const useGsapFrom = <T extends Element> (
    fromVars: gsap.TweenVars,
    tl?: gsap.core.Timeline,
    position?: gsap.Position
) => {
    return useGsap<T>(fromVars, undefined, tl, position);
};

export const useGsapTo = <T extends Element> (
    toVars: gsap.TweenVars,
    tl?: gsap.core.Timeline,
    position?: gsap.Position
) => {
    return useGsap<T>(undefined, toVars, tl, position);
};

export const useGsapFromTo = <T extends Element> (
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    tl?: gsap.core.Timeline,
    position?: gsap.Position
) => {
    return useGsap<T>(fromVars, toVars, tl, position);
};

export default useGsap;