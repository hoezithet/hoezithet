import React, { useRef, useMemo, useState, useCallback, useEffect, createContext, useContext } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
// Extend Three.js with additional geometries
extend({ OrbitControls });

import { scaleLinear } from 'components/drawings/drawing';

export const PLOT_MIN_VALUE = -10;
export const PLOT_MAX_VALUE = 10;

const PLOT_CAM_FOV = 50;
const PLOT_CAM_POS = [16, 16, 16];
const PLOT_FONT_SIZE = 0.4;
const PLOT_FONT_SIZE_LARGE = 0.5;

export const Plot3DContext = createContext({
    width: null,
    height: null,
    xScale: scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
    yScale: scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
    zScale: scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
});

// Camera-facing text component
export function CameraFacingText({
    position, children, size = 0.3, color = "black",
    anchorX="center", anchorY="middle", textAlign="left",
    opacity=1.0,
    ...props
}) {
    const meshRef = useRef();
    const { camera } = useThree();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.lookAt(camera.position);
        }
    });

    return (
        <Text
            ref={meshRef}
            position={position}
            fontSize={size}
            anchorX={anchorX}
            anchorY={anchorY}
            {...props}
        >
            {children}
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
            />
        </Text>
    );
}

// Arrow head component
export function ArrowHead({ position, direction, color = "red", transparent = false, opacity = 1.0, size = 0.1 }) {
    const mesh = useRef();

    const arrow = useMemo(() => {
        const geometry = new THREE.ConeGeometry(size, size * 2, 8);
        const material = new THREE.MeshBasicMaterial({ color, opacity, transparent });
        return { geometry, material };
    }, [color, size]);

    useEffect(() => {
        if (mesh.current) {
            const dir = new THREE.Vector3(...direction).normalize();
            const up = new THREE.Vector3(0, 1, 0);
            mesh.current.lookAt(new THREE.Vector3().addVectors(new THREE.Vector3(...position), dir));

            // Adjust rotation for cone geometry
            mesh.current.rotateX(Math.PI / 2);
        }
    }, [position, direction]);

    return (
        <mesh ref={mesh} position={position} geometry={arrow.geometry} material={arrow.material} />
        );
}

// Axes component
export function Axes({ 
    xLabel = "x",
    yLabel = "y", 
    zLabel = "z",
    tickCountX = 10,
    tickCountY = 10,
    tickCountZ = 10,
    showTicks = true,
    xColor = "red",
    yColor = "green",
    zColor = "blue",
    tickOpacity = 0.5,
    projectedPoints = [],
    hideThreshold = 0.3,
    formatTickX = (tick: Number) => tick.toFixed(0),
    formatTickY = (tick: Number) => tick.toFixed(0),
    formatTickZ = (tick: Number) => tick.toFixed(0),
}) {
    const { xScale, yScale, zScale } = useContext(Plot3DContext);
    const xTicks = useMemo(() => {
        return xScale.ticks(tickCountX);
    }, [tickCountX, xScale]);
    const yTicks = useMemo(() => {
        return yScale.ticks(tickCountY);
    }, [tickCountY, yScale]);
    const zTicks = useMemo(() => {
        return zScale.ticks(tickCountZ);
    }, [tickCountZ, zScale]);

    const shouldHideTick = (tickValue, projectedValue, threshold) => {
        return Math.abs(tickValue - projectedValue) < threshold;
    };

    return (
        <group>
            {/* X Axis */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={new Float32Array([PLOT_MIN_VALUE - 0.5, 0, 0, PLOT_MAX_VALUE + 0.5, 0, 0])}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={xColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
            </line>
            <ArrowHead 
                position={[PLOT_MAX_VALUE + 0.5, 0, 0]} 
                direction={[1, 0, 0]} 
                color={xColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}
            />
            <CameraFacingText 
                position={[PLOT_MAX_VALUE + 0.5, 0.1, 0]} 
                color={xColor}
                size={PLOT_FONT_SIZE_LARGE}
                anchorX="center"
                anchorY="bottom"
                textAlign="center"
                maxWidth={3}
            >
                {xLabel}
            </CameraFacingText>

        {/* Y Axis */}
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, PLOT_MIN_VALUE - 0.5, 0, 0, PLOT_MAX_VALUE + 0.5, 0])}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={yColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
        </line>
        <ArrowHead 
            position={[0, PLOT_MAX_VALUE + 0.5, 0]} 
            direction={[0, 1, 0]} 
            color={yColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}
        />
        <CameraFacingText 
            position={[0.0, PLOT_MAX_VALUE + 0.5, 0]} 
            color={yColor}
            size={PLOT_FONT_SIZE_LARGE}
            anchorX="center"
            anchorY="bottom"
            textAlign="center"
            maxWidth={3}
        >
            {yLabel}
        </CameraFacingText>

        {/* Z Axis */}
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, PLOT_MIN_VALUE - 0.5, 0, 0, PLOT_MAX_VALUE + 0.5])}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={zColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
        </line>
        <ArrowHead 
            position={[0, 0, PLOT_MAX_VALUE + 0.5]} 
            direction={[0, 0, 1]} 
            color={zColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}
        />
        <CameraFacingText 
            position={[0, 0.1, PLOT_MAX_VALUE + 0.5]}
            color={zColor}
            size={PLOT_FONT_SIZE_LARGE}
            anchorX="center"
            anchorY="bottom"
            textAlign="center"
            maxWidth={3}
        >
            {zLabel}
        </CameraFacingText>

        {/* Tick marks and labels */}
        {showTicks && (
            <>
                {/* X ticks */}
            {xTicks.map((tick, i) => (
                projectedPoints.some(p => shouldHideTick(tick, p[0], hideThreshold))
                ? null :
                <group key={`x-tick-${i}`}>
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([xScale(tick), -0.1, 0, xScale(tick), 0.1, 0])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color={xColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
                    </line>
                    <CameraFacingText 
                        position={[xScale(tick), -0.3, 0]} 
                        size={PLOT_FONT_SIZE}
                        color={xColor}
                        anchorY="top"
                        opacity={tickOpacity}
                    >
                        {formatTickX(tick)}
                    </CameraFacingText>
                </group>
        ))}

            {/* Y ticks */}
            {yTicks.map((tick, i) => (
                <group key={`y-tick-${i}`}>
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([-0.1, yScale(tick), 0, 0.1, yScale(tick), 0])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color={yColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
                    </line>
                    <CameraFacingText 
                        position={[-0.3, yScale(tick), 0]} 
                        size={PLOT_FONT_SIZE}
                        color={yColor}
                        textAlign="right"
                        anchorX="right"
                        opacity={tickOpacity}
                    >
                        {formatTickY(tick)}
                    </CameraFacingText>
                </group>
        ))}

            {/* Z ticks */}
            {zTicks.map((tick, i) => (
                projectedPoints.some(p => shouldHideTick(tick, p[2], hideThreshold))
                ? null :
                <group key={`z-tick-${i}`}>
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([0, -0.1, zScale(tick), 0, 0.1, zScale(tick)])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color={zColor} transparent={tickOpacity < 1.0} opacity={tickOpacity}/>
                    </line>
                    <CameraFacingText 
                        position={[0, -0.3, zScale(tick)]} 
                        size={PLOT_FONT_SIZE}
                        color={zColor}
                        anchorY="top"
                        opacity={tickOpacity}
                    >
                        {formatTickZ(tick)}
                    </CameraFacingText>
                </group>
        ))}
    </>
        )}
    </group>
);
}

// Scatter plot component
export function ScatterPlot({ data, pointSize = 0.1, color = "red" }) {
    return (
        <group>
            {data.map((point, i) => (
                <mesh key={i} position={point}>
                    <sphereGeometry args={[pointSize, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
        </group>
    );
}

// Point projection component - draws lines from point to axes with coordinate labels
export function PointProjection({ 
    point, 
    xColor = "red",
    yColor = "green",
    zColor = "blue",
    formatTickX = (tick) => tick.toFixed(0),
    formatTickY = (tick) => tick.toFixed(0),
    formatTickZ = (tick) => tick.toFixed(0),
}) {
    const [x, y, z] = point;

    const lineXRef = useRef();
    const lineYRef = useRef();
    const lineZRef = useRef();

    const { xScale, yScale, zScale } = useContext(Plot3DContext);

    useEffect(() => {
        lineXRef.current.array.set([
            xScale(x), 0, 0,
            xScale(x), 0, zScale(z)
        ]);
        lineXRef.current.needsUpdate = true;

        lineYRef.current.array.set([
            xScale(x), yScale(y), zScale(z),
            xScale(x), 0, zScale(z)
        ]);
        lineYRef.current.needsUpdate = true;

        lineZRef.current.array.set([
            xScale(x), 0, zScale(z),
            0, 0, zScale(z)
        ]);
        lineZRef.current.needsUpdate = true;
    }, [x, y, z, xScale, yScale, zScale]);

    return (
        <group>
            {/* X-axis projection */}
            <mesh position={[xScale(x), 0, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color={xColor} />
            </mesh>
            <CameraFacingText 
                position={[xScale(x), -PLOT_FONT_SIZE_LARGE, 0]} 
                size={PLOT_FONT_SIZE_LARGE}
                color={xColor}
            >
                {formatTickX(x)}
            </CameraFacingText>

        {/* Y-axis projection */}
        <mesh position={[xScale(x), yScale(y), zScale(z)]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color={yColor} />
        </mesh>
        <CameraFacingText 
            position={[xScale(x), yScale(y) + Math.sign(yScale(y)) * PLOT_FONT_SIZE_LARGE, zScale(z)]} 
            size={PLOT_FONT_SIZE_LARGE}
            color={yColor}
            anchorY={yScale(y) >= 0 ? "bottom" : "top"}
        >
            {formatTickY(y)}
        </CameraFacingText>

        {/* Z-axis projection */}
        <mesh position={[0, 0, zScale(z)]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color={zColor} />
        </mesh>
        <CameraFacingText 
            position={[0, -PLOT_FONT_SIZE_LARGE, zScale(z)]} 
            size={PLOT_FONT_SIZE_LARGE}
            color={zColor}
        >
            {formatTickZ(z)}
        </CameraFacingText>

        {/* Lines parallel to axes to form rectangular projection */}
        <line>
            <bufferGeometry>
                <bufferAttribute
                    ref={lineXRef}
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array(6)}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="gray" transparent />
        </line>
        <line>
            <bufferGeometry>
                <bufferAttribute
                    ref={lineYRef}
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array(6)}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="gray" transparent />
        </line>
        <line>
            <bufferGeometry>
                <bufferAttribute
                    ref={lineZRef}
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array(6)}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="gray" transparent />
        </line>
    </group>
);
}

// Surface plot component
export function SurfacePlot({ data, color = "white", wireframe = false, opacity=0.8 }) {
    const { xScale, yScale, zScale } = useContext(Plot3DContext);
    const mesh = useMemo(() => {
        const rows = data.length;
        const cols = data[0].length;

        const vertices = [];
        const indices = [];

        // Create vertices
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                vertices.push(xScale(data[i][j][0]), yScale(data[i][j][1]), zScale(data[i][j][2]));
            }
        }

        // Create faces
        for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
                const a = i * cols + j;
                const b = i * cols + j + 1;
                const c = (i + 1) * cols + j;
                const d = (i + 1) * cols + j + 1;

                // Two triangles per quad
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        return geometry;
    }, [data]);

    return (
        <mesh geometry={mesh}>
      {/* Projection points on axes with coordinate labels */}
            <meshLambertMaterial color={color} opacity={opacity} transparent={opacity < 1.0} wireframe={wireframe} side={THREE.DoubleSide} />
        </mesh>
    );
}

// Path plot component
export function PathPlot({ data, color = "purple", lineWidth = 2 }) {
    const points = useMemo(() => {
        return data.map(point => new THREE.Vector3(...point));
    }, [data]);

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [points]);

    return (
        <line geometry={geometry}>
            <lineBasicMaterial color={color} linewidth={lineWidth} />
        </line>
    );
}

// Main 3D Plot component
export function Plot3D({
    xScale = scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
    yScale = scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
    zScale = scaleLinear({range: [PLOT_MIN_VALUE, PLOT_MAX_VALUE], domain: [-10, 10]}), 
    xLabel = "x",
    yLabel = "y",
    zLabel = "z",
    xColor = "red",
    yColor = "green",
    zColor = "blue",
    showAxes = true,
    showTicks = true,
    backgroundColor = "#f0f0f0",
    width = '100%',
    height = '600px',
    formatTickX = (tick) => tick.toFixed(0),
    formatTickY = (tick) => tick.toFixed(0),
    formatTickZ = (tick) => tick.toFixed(0),
    tickHideThreshold = 0.,
    children = null,
}) {

    return (
        <div style={{ width, height, backgroundColor, margin: "auto" }}>
            <Canvas camera={{ position: PLOT_CAM_POS, fov: PLOT_CAM_FOV }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />

                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

                <Plot3DContext.Provider value={{width: width, height: height, xScale: xScale, yScale: yScale, zScale: zScale}}>
                    {showAxes && (
                        <Axes 
                            xLabel={xLabel}
                            yLabel={yLabel}
                            zLabel={zLabel}
                            xColor={xColor}
                            yColor={yColor}
                            zColor={zColor}
                            showTicks={showTicks}
                            projectedPoints={[[1, 2, 3]]}
                            formatTickX={formatTickX}
                            formatTickY={formatTickY}
                            formatTickZ={formatTickZ}
                            hideThreshold={tickHideThreshold}
                        />
                    )}
                   { children }
               </Plot3DContext.Provider>
           </Canvas>
       </div>
    );
}
