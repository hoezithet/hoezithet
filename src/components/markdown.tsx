import React from "react";
import useMarkdown from "hooks/useMarkdown";


type MarkdownPropTypes = {
    children: string,
    mathProcessor: string
}

const Markdown = ({children, mathProcessor = 'mathjax'}: MarkdownPropTypes) => {
    const [reactContent, setMarkdownSource] = useMarkdown(mathProcessor);

    React.useEffect(() => {
        setMarkdownSource(children);
    }, [children, setMarkdownSource]);
  
    return reactContent;
};

export default Markdown;
