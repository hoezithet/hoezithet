import React from "react";
import {unified} from 'unified';
import math from 'remark-math';
import remark from 'remark-parse';
import katex from 'rehype-katex';
import katexOptions from "../katexOptions";
import remark2rehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw'
import rehype2react from 'rehype-react';
import mathjaxOptions from "../mathjaxOptions";
import rehypeMathjaxSvg from 'rehype-mathjax/svg.js';
import {select, selectAll} from 'unist-util-select';


const useMarkdown = (markdownSource, mathProcessor: string = 'mathjax') => {
    return React.useMemo(() => {
        let processor = unified().use(remark)
            .use(dropParagraph);

        processor = processor
             .use(math)
             .use(remark2rehype, {allowDangerousHtml: true})
             .use(rehypeRaw);

        if (mathProcessor === 'katex') {
            processor = processor.use(katex, katexOptions);
        } else if (mathProcessor === 'mathjax') {
            processor = processor.use(rehypeMathjaxSvg, mathjaxOptions);
        }

        processor = processor.use(rehype2react, { createElement: React.createElement, Fragment: React.Fragment });
        return processor.processSync(markdownSource).result;
    }, [markdownSource]);
};


function dropParagraph() {
    return (tree) => {
        const p = select("root > *:only-child", tree);

        if (p && p.type === "paragraph") {
            tree.children = selectAll("root > paragraph > *", tree);
        }
        return tree;
    };
}


export default useMarkdown;
