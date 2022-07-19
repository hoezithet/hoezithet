import React, { DOMElement, useEffect } from "react";
import { Helmet } from "react-helmet";
import {unified} from "unified";
import math from "remark-math";
import remark from "remark-parse";
import rehype from "rehype-parse";
import katex from "rehype-katex";
import rehype_stringify from "rehype-stringify";
import remark_stringify from "remark-stringify";
import remark2rehype from "remark-rehype";
import rehype2remark from "rehype-remark";
import katexOptions from "../katexOptions"

const to_md = unified().use(rehype).use(rehype2remark, { newlines: true }).use(remark_stringify);
const to_katex = unified().use(remark).use(math).use(remark2rehype).use(katex, katexOptions).use(rehype_stringify);

// Helper to add scripts to our page
function insertScript(src: string, id: string, parentElement: HTMLElement) {
    const script = window.document.createElement("script");
    script.async = true;
    script.src = src;
    script.id = id;
    parentElement.appendChild(script);

    return script;
}

// Helper to remove scripts from our page
function removeScript(id: string, parentElement: HTMLElement) {
    const script = window.document.getElementById(id);
    if (script) {
        parentElement.removeChild(script);
    }
}

function renderMathInElement(el: HTMLElement) {
    const tag = "commento_katex_processed";
    if (el.classList.contains(tag)) {
        return;
    }

    el.classList.add(tag);
    to_md.process(el.innerHTML, (err, f) => {
        const md = String(f);
        to_katex.process(md, (err, f) => {
            el.innerHTML = String(f);
        });
    });
}

// The actual component
const Commento = () => {
    useEffect(() => {
        // If there's no window there's nothing to do for us
        if (!window) {
            return;
        }
        const document = window.document;

        // In case our #commento container exists we can add our commento script
        const commento = document.getElementById("commento");
        if (commento) {
            const commentoScript = insertScript(
                `https://commento.hoezithet.nu/js/commento.js`,
                `commento-script`,
                document.body
            );
            commentoScript.setAttribute("data-no-fonts", "true");
            commentoScript.setAttribute("data-css-override", "/css/commento.css");

            const observer = new MutationObserver((mutationsList, observer) => {
                const commentTexts = commento.querySelectorAll('[id^="commento-comment-text"]');
                commentTexts.forEach(c => renderMathInElement(c));
            });

            observer.observe(commento, { childList: true, subtree: true });
        }

        // Cleanup; remove the script from the page
        return () => removeScript(`commento-script`, document.body);
    });

    return <div id={`commento`} />;
};

export default function Comments() {
    return (
        <>
            <h2 id="comments">Vragen en reacties</h2>
            <Commento />
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
                    integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
                    crossOrigin="anonymous"
                />
            </Helmet>
        </>
    );
}
