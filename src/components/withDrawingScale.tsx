import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";


const withDrawingScale = <P> (
    Component: React.ComponentType<P>,
    normWidth: number,
    normHeight: number,
): React.FC<P> => {
    return (props: P) => {
        const { xScale, yScale } = React.useContext(DrawingContext);

        const scaleX = xScale.metric(normWidth)/normWidth;
        const scaleY = yScale.metric(normHeight)/normHeight;

        return (
            <g transform={`scale(${scaleX} ${scaleY})`}>
                <Component {...props} />
            </g>
        );
    };
};

export default withDrawingScale;
