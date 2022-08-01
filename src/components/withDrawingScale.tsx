import React from "react";
import { DrawingContext, scaleLinear } from "components/drawings/drawing";


const withDrawingScale = <P> (
    Component: React.ComponentType<P>,
    normWidth: number,
    normHeight: number,
): React.FC<P> => {
    return (props: P) => {
        const { xScale, yScale, ref } = React.useContext(DrawingContext);

        const scaleX = xScale.metric(normWidth)/normWidth;
        const scaleY = yScale.metric(normHeight)/normHeight;

        const newXScale = scaleLinear({
            range: [0, normWidth],
            domain: [0, normWidth],
        });
        const newYScale = scaleLinear({
            range: [0, normHeight],
            domain: [0, normHeight],
        });

        return (
            <g transform={`scale(${scaleX} ${scaleY})`}>
                <DrawingContext.Provider value={{width: normWidth, height: normHeight, xScale: newXScale, yScale: newYScale, ref: ref}}>
                    <Component {...props} />
                </DrawingContext.Provider>
            </g>
        );
    };
};

export default withDrawingScale;
