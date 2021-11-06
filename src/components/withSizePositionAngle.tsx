import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";


type ComponentProps = {
    width: number|null,
    height: number|null,
    x: number,
    y: number,
    angle: number,
}


const withSizePositionAngle = <P extends ComponentProps> (
    Component: React.ComponentType<P>,
    normWidth: number,
    normHeight: number,
    usingDrawingContext: boolean,
): React.FC<P & ComponentProps> => {
    normHeight = normHeight === undefined ? 100 : normHeight;
    normWidth = normWidth === undefined ? 100 : normWidth;
    usingDrawingContext = usingDrawingContext === undefined ? true : usingDrawingContext;
    
    return ({width=null, height=null, x, y, angle=0, ...props}: P) => {
        if (usingDrawingContext) {
            const { xScale, yScale } = React.useContext(DrawingContext);

            width = width !== null ? Math.abs(xScale(width) - xScale(0)) : null;
            height = height !== null ? Math.abs(yScale(height) - yScale(0)) : null;
            x = xScale(x);
            y = yScale(y);
        }

        let scaleX, scaleY;

        if (width !== null && height !== null) {
	        scaleX = width / normWidth;
	        scaleY = height / normHeight;
        } else if (width === null && height !== null) {
	        scaleY = height / normHeight;
            scaleX = scaleY;
        } else if (width !== null && height === null) {
	        scaleX = width / normWidth;
            scaleY = scaleX;
        } else {
            scaleX = 1;
            scaleY = 1;
        }

        return (
            <g transform={`rotate(${angle}) scale(${scaleX} ${scaleY}) translate(${x} ${y})`}>
                <Component {...props} />
            </g>
        );
    };
};


export default withSizePositionAngle;