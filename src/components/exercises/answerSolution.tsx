import React from "react";


type ReadableAnswerSolutionProps = {
    solution: React.ReactNode|React.ReactNode[],
};

export const ReadableAnswerSolution = ({ solution }: ReadableAnswerSolutionProps) => {
    if (Array.isArray(solution)) {
        return (
            <span>
                { solution.slice(0, -1).map((s, idx, arr) => (
                    <span key={idx}>
                        {s}
                        {idx === arr.length - 1 ? ' en ' : ', '}
                    </span>
                )) }
                {solution.slice(-1)[0]}
            </span>
        );
    } else {
        return solution;
    }
};
