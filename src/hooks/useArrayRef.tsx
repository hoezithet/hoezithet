import React from "react";


export default function useArrayRef() {
    const refs = React.useRef([]);
    refs.current = [];
    return [refs, (ref) => ref && refs.current.push(ref)];
}
