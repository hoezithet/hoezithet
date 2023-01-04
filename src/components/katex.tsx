import React from "react";
import katex from "katex";
import katexOptions from "../katexOptions";


export const Katex = ({children, display=false}) => {
    const html = React.useMemo(() => {
        return katex.renderToString(children, {
            ...katexOptions,
            displayMode: display,
            throwOnError: false
        })
    }, [children, display])

    const compProps = {
        dangerouslySetInnerHTML: { __html: html }
    };
    return display ? <div {...compProps}/> : <span {...compProps}/>;
};