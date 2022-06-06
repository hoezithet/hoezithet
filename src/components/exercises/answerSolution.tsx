import React from "react";
import styled from 'styled-components';

import Markdown from "components/markdown";

type QuotedProps = {
    children: React.ReactNode,
};

const QuoteChild = styled.span`
& div,p {
    display: inline-block;
    padding: 0;
    margin: 0;
}
`;

const Quoted = ({ children }: QuotedProps) => {
    return (
        <span>
            {'"'}
            <Markdown>{children}</Markdown>
            {'"'}
        </span>
    );
}; 

type ReadableAnswerSolutionProps = {
    solution: React.ReactNode|React.ReactNode[],
};

export const ReadableAnswerSolution = ({ solution }: ReadableAnswerSolutionProps) => {
    if (Array.isArray(solution)) {
        return (
            <span>
                { solution.slice(0, -1).map((s, idx, arr) => (
                    <span key={idx}>
                        <Quoted>{s}</Quoted>
                        {idx === arr.length - 1 ? ' en ' : ', '}
                    </span>
                )) }
                <Quoted>{solution.slice(-1)[0]}</Quoted>
            </span>
        );
    } else {
        return (
            <Quoted>{solution}</Quoted>
        );
    }
};
