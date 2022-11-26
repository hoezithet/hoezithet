import React from "react";
import {mathjax} from 'mathjax-full/js/mathjax.js'
import {TeX} from 'mathjax-full/js/input/tex.js'
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'
import options from "mathjaxOptions";

//
//  Minimal CSS needed for stand-alone image
//
const CSS = [
  'svg a{fill:blue;stroke:blue}',
  '[data-mml-node="merror"]>g{fill:red;stroke:red}',
  '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
  '[data-frame],[data-line]{stroke-width:70px;fill:none}',
  '.mjx-dashed{stroke-dasharray:140}',
  '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
  'use[data-c]{stroke-width:3px}'
].join('');


export const MathJax = ({children, display=false}) => {
    const adaptor = React.useMemo(() => liteAdaptor(), []);;

    const doc = React.useMemo(() => {
        const input = new TeX(Object.assign({packages: AllPackages}, options.tex));
        const output = new SVG(options.svg);
        const handler = RegisterHTMLHandler(adaptor);
        return mathjax.document('', {InputJax: input, OutputJax: output});
    }, []);

    const html = React.useMemo(() => {
        const node = doc.convert(children, {display: display});
        return node.innerHTML.replace(/<defs>/, `<defs><style>${CSS}</style>`);
    }, [children]);

    const compProps = {
        dangerouslySetInnerHTML: { __html: html }
    };
    return display ? <div {...compProps}/> : <span {...compProps}/>;
};
