import React from "react";


const md2react = (md_text: string, mathProcessor: string = 'katex') => {
    return md_text;
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


export default md2react;
