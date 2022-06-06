import React from "react";
import unified from 'unified';
import math from 'remark-math';
import remark from 'remark-parse';
import katex from 'rehype-katex';
import katexOptions from "../katexOptions";
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import mathjaxOptions from "../mathjaxOptions";
import rehypeMathjaxSvg from 'rehype-mathjax/svg.js';
import {select, selectAll} from 'unist-util-select';


const useMarkdown = (mathProcessor: string) => {
    const [reactContent, setReactContent] = React.useState<React.ReactElement | null>(null);

    const setMarkdownSource = React.useCallback((source: string) => {
        let processor = unified().use(remark);

        if (typeof source === "string" && (
              source.toLowerCase().startsWith("\n") ||
              source.toLowerCase().startsWith("\r") ||
              source.toLowerCase().startsWith("<p>"))) {
            processor = processor.use(dropParagraph);
        }

        processor = processor
             .use(math)
             .use(remark2rehype);

        if (mathProcessor === 'katex') {
            processor = processor.use(katex, katexOptions);
        } else if (mathProcessor === 'mathjax') {
            processor = processor.use(rehypeMathjaxSvg, mathjaxOptions);
        }

        processor = processor.use(rehype2react, { createElement: React.createElement, Fragment: React.Fragment });
        let isSubscribed = true;
        processor.process(source)
          .then((vfile) => {
              if (isSubscribed) {
                  setReactContent(vfile.result as React.ReactElement);
              }
          });

        return () => { isSubscribed = false };
    }, []);

    return [reactContent, setMarkdownSource];
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