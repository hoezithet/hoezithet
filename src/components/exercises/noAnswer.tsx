import React from 'react';

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type NoAnswerProps = {
    children: React.ReactNode,
    solution: string,
};


const _NoAnswer = ({ children, solution }: NoAnswerProps) => {
    const explanation = getChildAtIndex(children, 0) || null;
    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue<null>((a: any) => {
          return null;
      }, solution, explanation, true);

    React.useEffect(() => {
        setAnswerValue("bla");
    }, []);

    return <div><br/>(Noteer je antwoord zelf op papier.)</div>;
};

export const NoAnswer = withFeedback(_NoAnswer);
