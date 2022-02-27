import md2react from "../utils/md2react";


type MarkdownPropTypes = {
    children: string,
    mathProcessor: string
}

const Markdown = ({children, mathProcessor = 'mathjax'}: MarkdownPropTypes) => {
    return md2react(children, mathProcessor);
};

export default Markdown;