import React from "react";

type RubberHoseProps = {
    hoseModel: RubberHoseModel,
    color: string,
    outline?: string|null,
    outlineWidth?: number,
}


const _RubberHose = ({start, end, width, length, bendRadius, color, outline=null, outlineWidth=1}: RubberHoseProps, ref) => {
    const outlineRef = React.useRef(null);
    const hoseRef = React.useRef(null);
    const modelRef = React.useRef(new RubberHoseModel(start, end, width, length, bendRadius));
    const outlineWidthRef = React.useRef(outlineWidth);

    const updateHoses = () => {
        outlineRef.current?.setAttribute('d', modelRef.current.d);
        hoseRef.current?.setAttribute('d', modelRef.current.d);
        outlineRef.current?.setAttribute('strokeWidth', modelRef.current.width + outlineWidthRef.current);
        hoseRef.current?.setAttribute('strokeWidth', modelRef.current.width);
    };

    const getSetHoseProp = (propName) => (newValue = null) => {
        if (newValue !== null) {
            modelRef.current[propName] = newValue;
            updateHoses();
        }
        return modelRef.current[propName];
    };

    React.useImperativeHandle(ref, () => ({
        startX: getSetHoseProp('startX'),
        startY: getSetHoseProp('startY'),
        endX: getSetHoseProp('endX'),
        endY: getSetHoseProp('endY'),
        width: getSetHoseProp('width'),
        bendRadius: getSetHoseProp('bendRadius'),
        length: getSetHoseProp('length'),
        outlineWidth: getSetHoseProp('outlineWidth'),
        opacity: (newValue = null) => {
            if (newValue !== null) {
                outlineRef.current?.setAttribute('stroke-opacity', newValue);
                hoseRef.current?.setAttribute('stroke-opacity', newValue);
            }
            return hoseRef.current?.getAttribute('stroke-opacity');
        },
    }));

    return (
        <>
            <path ref={outlineRef} d={modelRef.current.d} stroke={outline || "rgba(0,0,0,0)"} fillOpacity={0} strokeWidth={modelRef.current.width + outlineWidth} strokeLinecap="round" />
            <path ref={hoseRef} d={modelRef.current.d} stroke={color} fillOpacity={0} strokeWidth={modelRef.current.width} strokeLinecap="round" />
        </>
    );
}

const RubberHose = React.forwardRef(_RubberHose); 

export type Point2D = {
    x: number,
    y: number
}


class RubberHoseModel {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    width: number;
    bendRadius: number;
    length: number;

    constructor(
        start: Point2D, end: Point2D, width: number,
        length: number, bendRadius: number = 1.0
    ) {
        this.startX = start.x;
        this.endX = end.x;
        this.startY = start.y;
        this.endY = end.y;
        this.width = width;
        this.bendRadius = bendRadius;
        this.length = length;
    }

    get d() {
        const [ctrlStart, ctrlEnd] = this.ctrlPoints;
        return `M ${this.startX},${this.startY} C ${ctrlStart.x},${ctrlStart.y} ${ctrlEnd.x},${ctrlEnd.y} ${this.endX},${this.endY}`;
    }

    get ctrlPoints() {
        const eps = 0.0001;
        this.bendRadius = typeof this.bendRadius === 'undefined' ? 1 : this.bendRadius;

        const dist = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
        const [dy, dx] = [this.endY - this.startY, this.endX - this.startX];
        let angleX;

        if (dx === 0 && dy >= 0) {
            angleX = Math.PI / 2;
        } else if (dx === 0 && dy < 0) {
            angleX = - Math.PI / 2;
        } else if (dx < 0) {
            angleX = Math.PI + Math.atan(dy/dx);
        } else {
            angleX = Math.atan(dy/dx);
        }

        const elongation = Math.min(dist / Math.max(this.length, eps), 1.0);

        // Calculate for horizontal hose first, rotate later
        const handleAngle = (1 - elongation)*Math.PI;
        const handleRadius = Math.sign(this.bendRadius)*(1 / Math.max(Math.abs(this.bendRadius), eps)) * this.length / 2;

        const ctrlStartOffset = rotatePoint({
            x: Math.abs(handleRadius) * Math.cos(-handleAngle),
            y: handleRadius * Math.sin(-handleAngle),
        }, angleX);

        const ctrlStart = {
            x: this.startX + ctrlStartOffset.x,
            y: this.startY + ctrlStartOffset.y,
        };

        const ctrlEndOffset = rotatePoint({
            x: Math.abs(handleRadius) * Math.cos(Math.PI + handleAngle),
            y: handleRadius * Math.sin(Math.PI + handleAngle),
        }, angleX);

        const ctrlEnd = {
            x: this.endX + ctrlEndOffset.x,
            y: this.endY + ctrlEndOffset.y,
        };

        return [ctrlStart, ctrlEnd];
    }
}

const rotatePoint = (point: Point2D, angle: number) => {
    return {
        x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
        y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    };
};

export { RubberHose, RubberHoseModel };
