import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import md2react from '../../utils/md2react'
import COLORS from '../../colors';
import { gsap } from 'gsap';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


type AnimTexPropsType = {
    children: string
}

const useStyles = makeStyles({
    root: {
        display: 'relative',
    }
});

/**
 * Return an animateable clone of a node. We assume that the parent
 * of the node is positioned.
 */
const getAnimateableClone = (node) => {
    const nodeRect = node.getBoundingClientRect();
    const nodeParent = node.parentNode;
    const parentRect = nodeParent.getBoundingClientRect(); 
    const nodeClone = node.cloneNode(true);

    nodeClone.style.display = "block";  
    nodeClone.style.position = "absolute";
    nodeClone.style.left = `${nodeRect.left - parentRect.left}px`;
    nodeClone.style.top = `${nodeRect.top - parentRect.top}px`;

    return nodeClone;
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
 * Return a gsap timeline that morphs the fromNodes into the toNodes.
 */
const getMorphSequence = (fromNodes, toNodes) => {
    const fromClones =  fromNodes.map(c => getAnimateableClone(c));
    const toClones =  toNodes.map(c => getAnimateableClone(c));
    fromClones.forEach((c, i) => fromNodes[i].parentNode.appendChild(c));
    toClones.forEach((c, i) => toNodes[i].parentNode.appendChild(c));

    const midpoint = getCenterBetweenNodes(...fromClones, ...toClones);

    gsap.set(toNodes, { opacity: 0 });
    const tl = gsap.timeline({
        onComplete: () => {
            fromClones.forEach(c => c.remove());
            toClones.forEach(c => c.remove());
            gsap.set(toNodes, { opacity: 1 });
        },
    });

    toClones.forEach(toClone => {
        fromClones.forEach(fromClone => {
            const animVars = nodeCenterToViewportPoint(fromClone, midpoint);
            tl.to(fromClone, {
                scale: 1.5,
                duration: 0.2,
                color: COLORS.ORANGE,
                ease: "power2.inOut",
            }, 0).to(fromClone, {
                ...animVars,
                scale: 1,
                duration: 0.5,
                opacity: 0,
                ease: "power2.in",
            }, 0.1);
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
const getMoveSequence = (fromNodes, toNodes) => {
    const toClones =  toNodes.map(c => getAnimateableClone(c));
    toClones.forEach((c, i) => toNodes[i].parentNode.appendChild(c));

    const midpoint = getCenterBetweenNodes(...fromNodes);

    gsap.set(toNodes, { opacity: 0 });
    const tl = gsap.timeline({
        onComplete: () => {
            toClones.forEach(c => c.remove());
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

const getAnimSequence = (anims) => {
    const animTypes = [...new Set(anims.map(a => a.animType))];
    if (animTypes.length !== 1) {
        throw `Expected anims to contain a single animation type, found: ${JSON.stringify(animTypes)}`;
    }
    const animType = animTypes[0];
    const fromNodes = filter(anims, ['fromOrTo', 'from']).map(a => a.node);
    const toNodes = filter(anims, ['fromOrTo', 'to']).map(a => a.node);

    switch (animType) {
        case 'move':
            return getMoveSequence(fromNodes, toNodes);
        case 'morph':
            return getMorphSequence(fromNodes, toNodes); 
    }
};

const getLabels = (nodes) => {
    return nodes.map(node => {
        const rgx = /\banimLabel(\S+)/;
        const className = node.className.split(' ').find(c => rgx.test(c));
        if (className === null) { return '0'; }
        else { return className.match(rgx)[1]; }
    });
};

const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat()))); 

export const AnimTex = ({ children }: AnimTexPropsType) => {
    const classes = useStyles();
    const [rootNode, setRootNode] = useState(null);

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

        const tl = gsap.timeline({ paused: true });

        // For each label
        const byLabel = groupBy(anims, 'label');
        Object.entries(byLabel).forEach(([label, animsWithLabel]) => {
            // Animate fromNodes to toNodes
            tl.add(getAnimSequence(animsWithLabel));
        });
        tl.play();
    };


    return (
        <div ref={nodeRefCallback} className={classes.root} >
            { md2react(children) }
            <Button onClick={handleClick} color="primary" variant="contained" disabled={rootNode === null} >Animate</Button>
        </div>
    );
};
