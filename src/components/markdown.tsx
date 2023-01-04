import React from "react";
import useMarkdown from "hooks/useMarkdown";


type MarkdownPropTypes = {
    children: string,
    mathProcessor: string,
}

const Markdown = ({children, mathProcessor = 'mathjax'}: MarkdownPropTypes) => {
    if (typeof children !== "string") {
        return children;
    }
    return useMarkdown(children, mathProcessor);
};

export default Markdown;
