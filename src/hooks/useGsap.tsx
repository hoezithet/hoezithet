import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';

type CallbackType = (anim: gsap.core.Tween) => void;

/**
 * Use gsap animation on a react component. If both fromVars and toVars are not
 * null, a "fromTo" tween will be used. If either fromVars or toVars are given,
 * a "from" tween, resp. "toTween", will be used.
 * 
 * @param callback Will be called when the animation is created.
 * @param fromVars From vars.
 * @param toVars To vars.
 * @returns The node ref to pass to the component you whish to animate.
 */
const useGsap = <T extends Element> (
    callback: CallbackType,
    fromVars?: gsap.TweenVars,
    toVars?: gsap.TweenVars,
) => {
    const nodeRef = useCallback((node: T|null) => {
        if (node !== null) {
            if (fromVars !== undefined && toVars !== undefined) {
                callback(gsap.fromTo(node, fromVars, toVars));
            } else if (fromVars !== undefined) {
                callback(gsap.from(node, fromVars));
            } else if (toVars !== undefined) {
                callback(gsap.to(node, toVars));
            }
        }
    }, []);

    return nodeRef;
};

export const useGsapFrom = <T extends Element> (
    fromVars: gsap.TweenVars,
    callback: CallbackType,
) => {
    return useGsap<T>(callback, fromVars);
};

export const useGsapTo = <T extends Element> (
    toVars: gsap.TweenVars,
    callback: CallbackType,
) => {
    return useGsap<T>(callback, toVars);
};

export const useGsapFromTo = <T extends Element> (
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    callback: CallbackType,
) => {
    return useGsap<T>(callback, fromVars, toVars);
};

export default useGsap;