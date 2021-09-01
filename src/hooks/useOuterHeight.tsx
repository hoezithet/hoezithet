import { useCallback, useState } from "react";
import getOuterHeight from "../utils/outerHeight";

export default function useOuterHeight(): [number|null, (node: HTMLElement) => void] {
    const [outerHeight, setOuterHeight] = useState<number|null>(null);
    const ref = useCallback((node: HTMLElement) => {
        if (node !== null) {
            setOuterHeight(getOuterHeight(node));
        }
    }, []);
    return [outerHeight, ref];
}