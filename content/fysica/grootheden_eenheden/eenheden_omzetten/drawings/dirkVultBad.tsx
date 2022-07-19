import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import Dirk from "./dirk";
import { getColor } from "colors";
import _ from "lodash";

import { TextAccolade } from "./watIs1m84";


const Pool = ({strokeWidth=0.1, poolX=24, poolY=0, poolLength: _poolLength=25, poolWidth: _poolWidth=21, poolDepth: _poolDepth=2, lanePathWidth=0.4, poolBorderWidth=1.0}) => {
    const { xScale, yScale } = React.useContext(DrawingContext);

    poolX = xScale(poolX);
    poolY = yScale(poolY);
    strokeWidth = xScale.metric(strokeWidth);
    const poolWidth = xScale.metric(_poolWidth);
    const poolLength = xScale.metric(_poolLength);
    const poolDepth = yScale.metric(_poolDepth);
    lanePathWidth = xScale.metric(lanePathWidth);
    poolBorderWidth = xScale.metric(poolBorderWidth);
    const fontSize = yScale.metric(2);
    const accStrokeWidth = xScale.metric(0.2);
    const stroke = getColor("near_white");
    const fill = getColor("light_blue", 0.5);
    const cos30 = Math.sqrt(3)/2;
    const sin30 = 1/2;

    const isoTopTfm = `rotate(30) skewX(-30) scale(1,${cos30})`;
    const isoLeftTfm = `skewY(30) scale(${cos30},1)`;
    const isoRightTfm = `skewY(-30) scale(${cos30},1)`;

    const numLanes = 8;
    const laneWidth = poolWidth/numLanes;

    const LanePath = () => (
        <g fill={getColor("black")}>
            <rect width={laneWidth} height={lanePathWidth} />
            <rect x={(laneWidth - lanePathWidth)/2} width={lanePathWidth} height={poolLength} />
            <rect y={poolLength - lanePathWidth} width={laneWidth} height={lanePathWidth} />
        </g>
    );

    const PoolBottom = () => {
        const laneScaleX = 0.6;
        const laneScaleY = 0.8;
        return (
            <g transform={`${isoTopTfm} rotate(180)`}>
                <rect width={poolWidth} height={poolLength} fill={getColor("near_white")} />
                { _.range(numLanes).map(i => (
                    <g key={i} transform={`translate(${i*laneWidth + (1 - laneScaleX)*0.5*laneWidth},${(1 - laneScaleY)*0.5*poolLength}) scale(${laneScaleX},${laneScaleY})`}>
                        <LanePath />
                    </g>
                  ))}
            </g>
        );
    };

    const Border = () => {
        return (
            <>
            <g transform={`translate(0,${-poolDepth}) ${isoTopTfm}`} fill={getColor("light_gray")}>
                <path d={`M ${poolBorderWidth},${poolBorderWidth} h ${-poolWidth - 2*poolBorderWidth} v ${-poolLength - 2*poolBorderWidth} h ${poolWidth + 2*poolBorderWidth} z M 0,0 v ${-poolLength} h ${-poolWidth} v ${poolLength} z`} />
                <TextAccolade x1={-poolWidth-3*poolBorderWidth} x2={-poolWidth} y={0}
                    color={getColor("orange")}
                    height={poolLength} width={poolBorderWidth}
                    fontSizePx={fontSize} strokeWidth={accStrokeWidth}>
                    {String.raw`$l=${_poolLength.toFixed(1)}~\si{m}$`}
                </TextAccolade>
                <g transform={`translate(${-poolWidth}) rotate(90)`}>
                    <TextAccolade x1={3*poolBorderWidth} x2={0} y={0} flipText
                        color={getColor("orange")}
                        height={poolWidth} width={poolBorderWidth}
                        fontSizePx={fontSize} strokeWidth={accStrokeWidth}>
                        {String.raw`$b=${_poolWidth.toFixed(1)}~\si{m}$`}
                    </TextAccolade>
                </g>
            </g>
            </>
        );
    };

    const HalfPoolOutline = () => (
        <>
            <path stroke={stroke} fill={fill} strokeWidth={strokeWidth} d={`M 0,0 h ${poolLength} v ${-poolDepth} h ${-poolLength} z`} strokeLinejoin="round" transform={isoRightTfm} />
            <path stroke={stroke} fill={fill} strokeWidth={strokeWidth} d={`M 0,0 h ${-poolWidth} v ${-poolDepth} h ${poolWidth} z`} strokeLinejoin="round" transform={isoLeftTfm} />
        </>
    );

    const PoolOutline = () => (
        <>
            <HalfPoolOutline />
            <g transform={`translate(${cos30*(poolLength - poolWidth)},${-poolDepth - sin30*(poolLength + poolWidth)}) scale(-1)`}>
                <HalfPoolOutline />
            </g>
        </>
    );

    return (
        <g transform={`translate(${poolX},${poolY})`}>
            <PoolBottom />
            <PoolOutline />
            <TextAccolade x1={5*poolBorderWidth} x2={0} y={0} flipText hText
                color={getColor("orange")}
                height={poolDepth} width={poolBorderWidth}
                fontSizePx={fontSize} strokeWidth={accStrokeWidth}>
                {String.raw`$d=${_poolDepth.toFixed(2)}~\si{m}$`}
            </TextAccolade>
            <Border />
        </g>
    );
};

const _DirkVultBad = () => {
    const { xScale, yScale } = React.useContext(DrawingContext);

    return (
      <>
        <Pool />
        <Dirk x={xScale(6)} y={yScale(12.5)} height={yScale.metric(1.84)} align="bottom center"/>
      </>
    )
};

const DirkVultBad = () => {
    return (
        <Drawing left={0} right={48} bottom={0} top={27} margin={0.05} noWatermark>
            {/**<DrawingGrid />**/}
            <_DirkVultBad />
        </Drawing>
    );
};


export default DirkVultBad;
