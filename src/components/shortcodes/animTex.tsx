import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import Markdown from 'components/markdown'
import COLORS from '../../colors';
import { gsap } from 'gsap';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import { nanoid } from '@reduxjs/toolkit'

const inClient = typeof window !== "undefined";
const MorphSVGPlugin = inClient ? require("gsap/dist/MorphSVGPlugin").MorphSVGPlugin : null;
const DrawSVGPlugin = inClient ? require("gsap/dist/DrawSVGPlugin").DrawSVGPlugin : null;

if (inClient) {
    gsap.registerPlugin(MorphSVGPlugin);
    gsap.registerPlugin(DrawSVGPlugin);
}

type AnimTexPropsType = {
    children: string
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
    }
});

const hideAllChildrenWithoutClass = (svg, className) => {
    if (svg?.className?.baseVal === className.baseVal) {
        return;
    }

    const children = Array.from(svg.children);
    if (children.length === 0
        && typeof svg.style !== 'undefined') {
        svg.style.opacity = 0;
    } else {
        children.forEach(child => {
            hideAllChildrenWithoutClass(child, className);
        });
    }
};

/**
 * Return animatable clones of the given MathJax SVG node, along with the
 * callback functions to properly clean it up.
 */
const getAnimateableClone = (node, parentNode) => {
    const svg = node.closest('svg');
    const svgWrapper = svg.parentNode;

    const svgRect = svg.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();

    const wrapperClone = svgWrapper.cloneNode(true);
    const svgClone = wrapperClone.firstChild;
    hideAllChildrenWithoutClass(svgClone, node.className);
    svgClone.style.position = "absolute";
    svgClone.style.left = `${svgRect.left - parentRect.left}px`;
    svgClone.style.top = `${svgRect.top - parentRect.top}px`;

    parentNode.appendChild(wrapperClone);

    return [
        svgClone,
        () => wrapperClone.remove()
    ];
};

/**
 * Return the center of a bounding client rectangle.
 */
const getRectCenter = (rect) => {
    return {
        x: rect.x + rect.width/2,
        y: rect.y + rect.height/2,
    }; 
};

/**
 * Return the point in the center between multiple points.
 */
const getCenterBetweenPoints = (...points) => {
    return points.reduce((acc, point) => {
        return {
            x: acc.x + point.x/points.length,
            y: acc.y + point.y/points.length,
        };
    }, {x: 0, y: 0});
};

/**
 * Return the origin of the node, in viewport coordinates.
 */
const getNodeOrigin = (node) => {
    const nodeRect = node.getBoundingClientRect();

    return {
        x: nodeRect.x - gsap.getProperty(node, "x"),
        y: nodeRect.y - gsap.getProperty(node, "y"),
    };
};

/**
 * Return the center of the node, in viewport coordinates.
 */
const getNodeCenter = (node) => {
    return getRectCenter(node.getBoundingClientRect());
};

/**
 * Return the point in the center between multiple nodes, relative
 * to the viewport.
 */
const getCenterBetweenNodes = (...nodes) => {
    const nodeCenters = nodes.map(n => getNodeCenter(n));
    return getCenterBetweenPoints(...nodeCenters);
};

/**
 * Return the center point between a node and a point in
 * viewport coordinates.
 */
const getCenterBetweenNodeAndPoint = (node, point) => {
    const nodeCenter = getNodeCenter(node);
    return getCenterBetweenPoints(nodeCenter, point);
};

/**
 * Convert the coordinates of a viewport point into coordinates
 * relative to the given node.
 */
const convertViewportToNodeCoords = (viewportPoint, node) => {
    // Define node origin rel to viewport
    const nodeOrigin = getNodeOrigin(node);

    return {
        x: viewportPoint.x - nodeOrigin.x,
        y: viewportPoint.y - nodeOrigin.y,
    };    
};

/**
 * Return coordinates to animate to when we want to move
 * the center of a node to point given in viewport coordinates.
 *
 * The returned coordinates are relative to the origin of the node.
 */
const nodeCenterToViewportPoint = (fromNode, toPoint) => {
    const fromRect = fromNode.getBoundingClientRect();
    const nodePoint = convertViewportToNodeCoords(toPoint, fromNode);

    // Top left of fromNode to center align with toPoint (rel to fromNode origin)
    return {
        x: nodePoint.x - fromRect.width/2,
        y: nodePoint.y - fromRect.height/2,
    };
};

/**
 * Return coordinates to animate to when we want to move the center of a node
 * to the center of another node.
 */
const nodeCenterToNodeCenter = (fromNode, toNode) => {
    // Center of toNode rel to viewport
    const toCenter = getNodeCenter(toNode);

    return nodeCenterToViewportPoint(fromNode, toCenter);    
};


/**
 * Return animatable clones of the given MathJax SVG nodes, along with a
 * callback function that properly cleans them up.
 */
const getAnimatableClones = (nodes, parentNode) => {
    const clonesWithCallback = nodes.map(c => getAnimateableClone(c, parentNode));
    const clones = clonesWithCallback.map(cloneWithCb => cloneWithCb[0]);
    const cleanUpCallbacks = clonesWithCallback.map(cloneWithCb => cloneWithCb[1]);
    const cleanUpClones = () => {
        cleanUpCallbacks.forEach(callback => callback());
    };
    return [clones, cleanUpClones];
};

/**
 * Return a gsap timeline that morphs the fromNodes into the toNodes.
 */
const getMorphSequence = (fromNodes, toNodes, parentNode) => {
    const [fromClones, cleanUpFromClones] = getAnimatableClones(fromNodes, parentNode);
    const [toClones, cleanUpToClones] =  getAnimatableClones(toNodes, parentNode);

    const midpoint = getCenterBetweenNodes(...fromClones, ...toClones);

    gsap.set(fromClones, { opacity: 0 });
    gsap.set(toNodes, { opacity: 0 });
    const tl = gsap.timeline({
        onComplete: () => {
            cleanUpToClones();
            cleanUpFromClones();
            gsap.set(toNodes, { opacity: 1 });
        },
    });

    toClones.forEach(toClone => {
        fromClones.forEach(fromClone => {
            const animVars = nodeCenterToViewportPoint(fromClone, midpoint);
            tl.to(fromClone, {
                scale: 1.5,
                duration: 0.5,
                opacity: 1,
                color: COLORS.ORANGE,
                ease: "power2.inOut",
            }, 0).to(fromClone, {
                ...animVars,
                scale: 1,
                duration: 1,
                opacity: 0,
                ease: "power2.in",
            }, 0.5);
        });

        tl.from(toClone, {
            ...nodeCenterToViewportPoint(toClone, midpoint),
            opacity: 0,
            color: COLORS.ORANGE,
            duration: 1,
            ease: "power2.out",
        }, "morphEnd");
    });
    return tl;
};

/**
 * Return a gsap timeline that moves the fromNodes to the toNodes.
 */
const getMoveSequence = (fromNodes, toNodes, parentNode) => {
    const [toClones, cleanUpToClones] = getAnimatableClones(toNodes, parentNode);

    const midpoint = getCenterBetweenNodes(...fromNodes);

    gsap.set(toNodes, { opacity: 0 });
    const tl = gsap.timeline({
        onComplete: () => {
            cleanUpToClones();
            gsap.set(toNodes, { opacity: 1 });
        },
    });

    toClones.forEach(toClone => {
        tl.from(toClone, {
            ...nodeCenterToViewportPoint(toClone, midpoint),
            opacity: 0,
            duration: 1,
            ease: "power2.out",
        }, "moveEnd");
    });
    return tl;
};

const getAnimSequence = (anims, parentNode) => {
    const animTypes = [...new Set(anims.map(a => a.animType))];
    if (animTypes.length !== 1) {
        throw `Expected anims to contain a single animation type, found: ${JSON.stringify(animTypes)}`;
    }
    const animType = animTypes[0];
    const fromNodes = filter(anims, ['fromOrTo', 'from']).map(a => a.node);
    const toNodes = filter(anims, ['fromOrTo', 'to']).map(a => a.node);

    switch (animType) {
        case 'move':
            return getMoveSequence(fromNodes, toNodes, parentNode);
        case 'morph':
            return getMorphSequence(fromNodes, toNodes, parentNode); 
    }
};

const getLabels = (nodes) => {
    return nodes.map(node => {
        const rgx = /\banimLabel(\S+)/;
        const className = node.className.baseVal.split(' ').find(c => rgx.test(c));
        if (className === null) { return '0'; }
        else { return className.match(rgx)[1]; }
    });
};

const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat()))); 

export const AnimTex = ({ children }: AnimTexPropsType) => {
    const classes = useStyles();
    const [rootNode, setRootNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const nodeRefCallback = useCallback((node) => {
        setRootNode(node);
    }, []);

    const handleClick = () => {
        if (!rootNode) { return; }
        const animTypes = ['morph', 'move'];
        const fromOrTos = ['from', 'to'];

        let anims = [];
        cartesian(animTypes, fromOrTos).forEach(([animType, fromOrTo]) => {
            const nodes = Array.from(rootNode.getElementsByClassName(
                `${animType}${fromOrTo[0].toUpperCase() + fromOrTo.slice(1)}`)
            )
            const labels = getLabels(nodes);
            nodes.forEach((node, i) => {
                anims.push({
                    'label': labels[i],
                    'node': node,
                    'animType': animType,
                    'fromOrTo': fromOrTo,
                });
            });
        });

        // Sort by label
        anims = sortBy(anims, 'label');
        anims.sort((a, b) => a.time - b.time);

        const tl = gsap.timeline({
            paused: true,
            onComplete: () => setIsAnimating(false)
        });

        // For each label
        const byLabel = groupBy(anims, 'label');
        Object.entries(byLabel).forEach(([label, animsWithLabel]) => {
            // Animate fromNodes to toNodes
            tl.add(getAnimSequence(animsWithLabel, rootNode));
        });

        setIsAnimating(true);
        tl.play();
    };

    return (
        <div ref={nodeRefCallback} className={classes.root} >
            <Markdown>{ children }</Markdown>
            <Button onClick={handleClick} color="primary" variant="contained" disabled={rootNode === null || isAnimating} >Animate</Button>
        </div>
    );
};

type ExplanationStepPropsType = {
    children: React.ReactNode,
    before: string,
    after: string,
    explanation: string,
    detailedExplanation?: string,
    arrow: string,
}

const drawMath = (pathNode, highlight=true) => {
    const tl = gsap.timeline();
    const colorTo = gsap.getProperty(pathNode, "color");
    const strokeWidthTo = gsap.getProperty(pathNode, "strokeWidth");
    return tl.fromTo(pathNode, {
        drawSVG: 0,
        strokeWidth: 100,
        color: highlight ? COLORS.GOLD : colorTo,
        fillOpacity: 0,
    }, {
        drawSVG: "100%",
        duration: 0.5,
    }).to(pathNode, {
        fillOpacity: 1,
        strokeWidth: strokeWidthTo,
        duration: 0.5,
        color: colorTo,
    });
};

/**
 * Children contains optional substeps.
 */
export const ExplanationStep = ({ children=null, beforeLhs, beforeRhs, afterLhs, afterRhs, selector, explanation, arrow='equivalence', detailedExplanation=null }: ExplanationStepPropsType) => {
    const classes = useStyles();
    const [rootNode, setRootNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const nodeRefCallback = useCallback((node) => {
        setRootNode(node);
    }, []);

    const handleClick = () => {
        if (!rootNode) { return; }

        const tl = gsap.timeline({
            paused: true,
            onComplete: () => setIsAnimating(false)
        });


        const eqnArrowPath = rootNode.querySelector(
            '.eqnArrow g[data-mml-node="math"] path'
        )
        tl.add(drawMath(eqnArrowPath));
        
        const mathPaths = Array.from(rootNode.querySelectorAll(selector));
        Array.from(rootNode.querySelectorAll(
           `.eqnAfter path, .eqnAfter rect`
        )).filter(
            pathOrRect => !mathPaths.includes(pathOrRect)
        ).forEach(
            pathOrRect => tl.add(drawMath(pathOrRect), "-=50%")
        );

        tl.add(() => {}, "+=1");

        mathPaths.forEach((radicalPath, i) => tl.add(drawMath(radicalPath), "-=50%"));

        setIsAnimating(true);
        tl.play();
    };
    
    let arrowTeX;
    switch (arrow) {
        case 'equivalence':
            arrowTeX = "\\Updownarrow";
            break;
        case 'implication':
            arrowTeX = "\\Downarrow";
            break;
    }
    
    return (
        <div ref={nodeRefCallback} className={classes.root} >
            <Markdown>{ `${explanation.endsWith(':') ? explanation.slice(-1) : explanation}:` }</Markdown>
            <div className="eqnBefore">
                <Markdown>{`$$\n${beforeLhs} = ${beforeRhs}\n$$`}</Markdown>
            </div>
            <div className="eqnArrow">
                <Markdown>{`$$\n${arrowTeX}\n$$`}</Markdown>
            </div>
            <div className="eqnAfter">
                <Markdown>{`$$\n${afterLhs} = ${afterRhs}\n$$`}</Markdown>
            </div>
            <Button onClick={handleClick} color="primary" variant="contained" disabled={rootNode === null || isAnimating} >Animate</Button>
        </div>
    );
};


export const EqnSqrtStep = ({ lhs, rhs }) => {
    const afterLhs = String.raw`\class{sqrtLhs}{\sqrt{${lhs}}}`;
    const afterRhs = String.raw`\class{pm}{\pm}\class{sqrtRhs}{\sqrt{${rhs}}}`;

    const sqrtSel = '.sqrtLhs > [data-mml-node="mo"] path, .sqrtLhs > rect, .pm > path, .sqrtRhs > [data-mml-node="mo"] path, .sqrtRhs > rect';

    return (
        <ExplanationStep beforeLhs={lhs} beforeRhs={rhs} afterLhs={afterLhs} afterRhs={afterRhs} selector={sqrtSel}
            explanation="Neem de vierkantswortel aan beide zijden van het gelijkteken" />
    );
};
