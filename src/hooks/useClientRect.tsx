import { useCallback, useState } from "react";

export default function useClientRect(): [ClientRect|null, (node: any) => void] {
    const [rect, setRect] = useState<ClientRect|null>(null);
    const ref = useCallback(node => {
        if (node !== null) {
            setRect(node.getBoundingClientRect());
        }
    }, []);
    return [rect, ref];
}