import React from "react";
import unified from 'unified';
import math from 'remark-math';
import remark from 'remark-parse';
import katex from 'rehype-katex';
import katexOptions from "../katexOptions";
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import mathjax from 'rehype-mathjax';
import mathjaxOptions from "../mathjaxOptions";

const md2react = (md_text: string, mathProcessor: string = 'katex') => {
    let processor = unified()
        .use(remark)
        .use(math)
        .use(remark2rehype);
   
    if (mathProcessor === 'katex') {
        processor = processor.use(katex, katexOptions);
    } else if (mathProcessor === 'mathjax') {
        processor = processor.use(mathjax, mathjaxOptions);
    }
        
    processor = processor.use(rehype2react, { createElement: React.createElement });
    return processor.processSync(md_text).result as JSX.Element;
}; 

type MarkdownPropTypes = {
    children: string,
    mathProcessor: string
}

export const Markdown = ({children, mathProcessor}: MarkdownPropTypes) => {
    return md2react(children, mathProcessor);
};

export default md2react;
