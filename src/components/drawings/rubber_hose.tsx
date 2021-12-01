import React from "react";

type RubberHoseProps = {
    hoseModel: RubberHoseModel,
    color: string,
    outline?: string|null,
    outlineWidth?: number,
}


const _RubberHose = ({hoseModel, color, outline=null, outlineWidth=1}: RubberHoseProps, ref) => {
    const hoseRef = React.useRef();
    const outlineRef = React.useRef();

    React.useImperativeHandle(ref, () => ({
      get refs() {
          return [hoseRef.current, outlineRef.current];
      },
    }));

    return (
        <>
            <path ref={outlineRef} d={hoseModel.d} stroke={outline || "rgba(0,0,0,0)"} fillOpacity={0} strokeWidth={hoseModel.width + outlineWidth} strokeLinecap="round" />
            <path ref={hoseRef} d={hoseModel.d} stroke={color} fillOpacity={0} strokeWidth={hoseModel.width} strokeLinecap="round" />
        </>
    );
}

const RubberHose = React.forwardRef(_RubberHose); 

export type Point2D = {
    x: number,
    y: number
}


class RubberHoseModel {
    start: Point2D;
    end: Point2D;
    width: number;
    bendRadius: number;
    length: number;

    constructor(
        start: Point2D, end: Point2D, width: number,
        length: number, bendRadius: number = 1.0
    ) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.bendRadius = bendRadius;
        this.length = length;
    }

    get d() {
        const [ctrlStart, ctrlEnd] = this.ctrlPoints;
        return `M ${this.start.x},${this.start.y} C ${ctrlStart.x},${ctrlStart.y} ${ctrlEnd.x},${ctrlEnd.y} ${this.end.x},${this.end.y}`;
    }

    get ctrlPoints() {
        const eps = 0.0001;
        this.bendRadius = typeof this.bendRadius === 'undefined' ? 1 : this.bendRadius;

        const dist = Math.sqrt(Math.pow(this.end.x - this.start.x, 2) + Math.pow(this.end.y - this.start.y, 2));
        const [dy, dx] = [this.end.y - this.start.y, this.end.x - this.start.x];
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
            x: this.start.x + ctrlStartOffset.x,
            y: this.start.y + ctrlStartOffset.y,
        };

        const ctrlEndOffset = rotatePoint({
            x: Math.abs(handleRadius) * Math.cos(Math.PI + handleAngle),
            y: handleRadius * Math.sin(Math.PI + handleAngle),
        }, angleX);

        const ctrlEnd = {
            x: this.end.x + ctrlEndOffset.x,
            y: this.end.y + ctrlEndOffset.y,
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
