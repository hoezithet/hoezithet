import React, { useContext } from 'react';
import _ from "lodash";

import { getColor } from "../../colors";
import { DrawingContext } from "./drawing";
import { useStyles } from "./line";

const DrawingGrid = ({color="light_gray", major=10, opacity=1, lineWidth=1}) => {
    const {xScale, yScale, width, height} = useContext(DrawingContext);
    color = getColor(color);
    const minorClasses = useStyles({color: color, lineWidth: lineWidth, opacity: opacity});
    const majorClasses = useStyles({color: color, lineWidth: 2*lineWidth, opacity: opacity});

    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();

    return (
        <>
        {
            _.range(Math.floor(xMin), Math.ceil(xMax) + 1).map(i => {
                const isMajor = major && i % major == 0;

                return (
                    <>
                    <path d={`M ${xScale(i)},0 v ${height}`} className={isMajor ? majorClasses.line : minorClasses.line} key={i}/>
                    { isMajor ?
                        <text x={xScale(i)} y="12" fontSize="12" fontFamily="sans-serif">{ i }</text>
                        : null
                    }
                    </>
                );
            }
            )
        }
        {
            _.range(Math.floor(yMin), Math.ceil(yMax) + 1).map(i => {
                const isMajor = major && i % major == 0;

                return (
                    <>
                    <path d={`M 0,${yScale(i)} h ${width}`} className={isMajor ? majorClasses.line : minorClasses.line} key={i}/>
                    { isMajor ?
                        <text x="0" y={yScale(i)} fontSize="12" fontFamily="sans-serif">{ i }</text>
                        : null
                    }
                    </>
                );
            }
            )
        }
        </>
    );
};

export default DrawingGrid;
