import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";


type ComponentProps = {
    width: number|null,
    height: number|null,
    x: number,
    y: number,
    angle: number,
    vAlign: "top"|"center"|"bottom",
    hAlign: "left"|"center"|"right",
    ignoreDrawingContext: boolean,
    flipH: boolean,
    flipV: boolean,
    angleAnchorRelX: number|null,
    angleAnchorRelY: number|null,
}


const withSizePositionAngle = <P extends ComponentProps> (
    Component: React.ComponentType<P>,
    normWidth: number,
    normHeight: number,
): React.FC<P & ComponentProps> => {
    normHeight = normHeight === undefined ? 100 : normHeight;
    normWidth = normWidth === undefined ? 100 : normWidth;

    return ({
    width=null, height=null,
    x=0, y=0, angle=0,
    vAlign="top", hAlign="left",
    ignoreDrawingContext=false,
    flipH=false, flipV=false,
    angleAnchorRelX=null, angleAnchorRelY=null,
    ...props}: P) => {
        let shiftX, shiftY, scaleX, scaleY;

        if (ignoreDrawingContext) {
            shiftX = x;
            shiftY = y;
        } else {
            const { xScale, yScale } = React.useContext(DrawingContext);

            width = width !== null ? Math.abs(xScale(width) - xScale(0)) : null;
            height = height !== null ? Math.abs(yScale(height) - yScale(0)) : null;
            shiftX = xScale(x);
            shiftY = yScale(y);
        }

        if (width !== null && height !== null) {
	        scaleX = width / normWidth;
	        scaleY = height / normHeight;
        } else if (width === null && height !== null) {
	        scaleY = height / normHeight;
            scaleX = scaleY;
            width = normWidth * scaleX;
        } else if (width !== null && height === null) {
	        scaleX = width / normWidth;
            scaleY = scaleX;
            height = normHeight * scaleY;
        } else {
            scaleX = 1;
            scaleY = 1;
            width = normWidth;
            height = normHeight;
        }

        if (flipH) {
            scaleX *= -1;
            shiftX += width;
        }
        if (flipV) {
            scaleY *= -1;
            shiftY += height;
        }

        if (hAlign === "center") {
            shiftX -= width/2;
        } else if (hAlign === "right") {
            shiftX -= width;
        }

        if (vAlign === "center") {
            shiftY -= height/2;
        } else if (vAlign === "bottom") {
            shiftY -= height;
        }

        const rotateArg = (
        angleAnchorRelX !== null && angleAnchorRelY !== null ?
        `${angle} ${angleAnchorRelX*normWidth} ${angleAnchorRelY*normHeight}`
        : `${angle}`
        );


        return (
            <g transform={`translate(${shiftX} ${shiftY}) rotate(${rotateArg}) scale(${scaleX} ${scaleY})`}>
                <Component {...props} />
            </g>
        );
    };
};


export default withSizePositionAngle;
