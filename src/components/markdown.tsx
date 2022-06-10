import React from "react";
import useMarkdown from "hooks/useMarkdown";


type MarkdownPropTypes = {
    children: string,
    mathProcessor: string,
    onComplete: () => void,
}

const Markdown = ({children, mathProcessor = 'mathjax', onComplete = () => {}}: MarkdownPropTypes) => {
    const [reactContent, setMarkdownSource] = useMarkdown(mathProcessor, onComplete);

    React.useEffect(() => {
        setMarkdownSource(children);
    }, [children, setMarkdownSource]);
  
    return reactContent;
};

export default Markdown;
