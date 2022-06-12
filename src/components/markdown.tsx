import React from "react";
import useMarkdown from "hooks/useMarkdown";


type MarkdownPropTypes = {
    children: string,
    mathProcessor: string,
}

const Markdown = ({children, mathProcessor = 'mathjax'}: MarkdownPropTypes) => {
    return useMarkdown(children);
};

export default Markdown;
