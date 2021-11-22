import React from "react";
import { DrawingContext } from "components/shortcodes/drawing";
import { gsap } from "gsap";


const withInfLoop = (Component) => {
    return ({speed=0, x, width, ...props}) => {
        const { width: drawingWidth, addAnimation, xScale } = React.useContext(DrawingContext);

        const xOrigin = xScale(0);
        const max_shift_px = Math.max(Math.abs(xScale(width) - xScale(0)), drawingWidth);
        const ref1 = React.useRef();
        const ref2 = React.useRef();
        const ref3 = React.useRef();

        React.useEffect(() => {
            if (speed === 0) {
                return;
            }
            const tl = gsap.timeline({repeat: -1});
            tl.fromTo([ref1, ref2, ref3].map(ref => ref.current), {
                x: xScale(x),
            }, {
                x: `+=${Math.sign(speed)*max_shift_px}`,
                duration: max_shift_px/Math.abs(speed),
                ease: "none",
            });
            addAnimation(tl, 0);
        }, [x, speed, max_shift_px]);

        return (
            <>
                <g ref={ref1}>
                  <Component x={x - xScale.invert(max_shift_px + xOrigin)} width={width}  {...props} />
                </g>
                <g ref={ref2}>
                  <Component x={x} width={width}  {...props} />
                </g>
                <g ref={ref3}>
                  <Component x={x + xScale.invert(max_shift_px + xOrigin)} width={width} {...props} />
                </g>
            </>
        );
    };
};

export default withInfLoop;
