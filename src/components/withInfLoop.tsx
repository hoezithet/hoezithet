import React from "react";
import { DrawingContext } from "components/drawings/drawing";
import { gsap } from "gsap";


const withInfLoop = (Component) => {
    return ({speed=0, x, width, ...props}) => {
        const { addAnimation } = React.useContext(DrawingContext);

        const xOrigin = 0;
        const widthPx = width;
        const max_shift_px = widthPx;
        const ref1 = React.useRef();
        const ref2 = React.useRef();
        const ref3 = React.useRef();

        React.useEffect(() => {
            if (speed === 0) {
                return;
            }
            const tl = gsap.timeline({repeat: -1});
            tl.fromTo([ref1, ref2, ref3].map(ref => ref.current), {
                x: x,
            }, {
                x: `+=${Math.sign(speed)*max_shift_px}`,
                duration: max_shift_px/Math.abs(speed),
                ease: "none",
            });
            addAnimation(tl, 0);
        }, [x, speed, max_shift_px]);

        const shift = max_shift_px;

        return (
            <>
                <g ref={ref1}>
                  <Component x={x - shift} width={width}  {...props} />
                </g>
                <g ref={ref2}>
                  <Component x={x} width={width}  {...props} />
                </g>
                <g ref={ref3}>
                  <Component x={x + shift} width={width} {...props} />
                </g>
            </>
        );
    };
};

export default withInfLoop;
