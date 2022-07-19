import React from "react";


type ComponentProps = {
    width: number|null,
    height: number|null,
    x: number,
    y: number,
    angle: number,
    align: (
        "top left"|"center left"|"bottom left"|
        "top center"|"center center"|"bottom center"|
        "top right"|"center right"|"bottom right"
    ),
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

    return (props: P) => {
        let {
            width=null, height=null,
            x=0, y=0, angle=0,
            align="top left",
            flipH=false, flipV=false,
            angleAnchorRelX=null, angleAnchorRelY=null,
        } = props;

        let shiftX, shiftY, scaleX, scaleY;

        shiftX = x;
        shiftY = y;

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

        const [vAlign, hAlign] = align.split(" ");
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
