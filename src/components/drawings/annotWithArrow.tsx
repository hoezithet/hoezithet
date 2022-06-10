import React from "react";

import { AnnotProps, Annot } from "./annot";
import { AnnotArrowProps, AnnotArrow } from "./annotArrow";


type AnnotWithArrowProps = {
    ...AnnotProps,
    ...AnnotArrowProps
};

export const AnnotWithArrow = (props: AnnotWithArrowProps) => {
    const [isAnnotReady, setIsAnnotReady] = React.useState(false);

    return (
        <>  
            <Annot {...props} onComplete={() => setIsAnnotReady(true)} />
            { isAnnotReady ? <AnnotArrow {...props} /> : null }
        </>
    );
}