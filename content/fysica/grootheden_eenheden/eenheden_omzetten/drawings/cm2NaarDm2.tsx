import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import { MathJax } from "components/mathjax";
import { Katex as K } from "components/katex";
import useId from 'hooks/useId';


const Cm2NaarDm2Child = () => {
    const tellerId = useId();
    const noemerId = useId();
    const annotTellerId = useId();
    const annotNoemerId = useId();
    const {xScale, yScale} = React.useContext(DrawingContext);
 

    const annotTeller = String.raw``;

    const fontSize = `${yScale.metric(4)}px`;
    const anchorRadius = yScale.metric(10);

    return (
        <>
            <Annot x={xScale(40)} y={yScale(70)} fontSize={fontSize} width={xScale.metric(40)} align="bottom right" Wrapper={React.Fragment}>
                We komen van <em>centi-</em> met een exponent <K>{String.raw`\orange{2},`}</K> dus in de <em>teller</em> komt <span id={annotTellerId}><K>{String.raw`\orange{\left(10^{-2}\right)^{\! 2}}`}</K></span>
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize={fontSize} Wrapper={React.Fragment}>
                <K display>{String.raw`
                    1~\si{\orange{c}m}^{\orange{2}} = \frac{\htmlId{${tellerId}}{\orange{\left(10^{-2}\right)^{\!2}}}}{\htmlId{${noemerId}}{\blue{\left(10^{-1}\right)^{\!2}}}}~\si{\blue{d}m}^{\blue{2}}
                `}</K>
            </Annot>
            <Annot x={xScale(40)} y={yScale(40)} fontSize={fontSize} width={xScale.metric(40)} align="top right" Wrapper={React.Fragment}>
                We gaan naar <em>deci-</em> met een exponent <K>{String.raw`\blue{2},`}</K> dus in de <em>noemer</em> komt <span id={annotNoemerId}><K>{String.raw`\blue{\left(10^{-1}\right)^{\! 2}}`}</K></span>
            </Annot>
            <AnnotArrow annot={[xScale(40.5), yScale(73)]} target={[xScale(54), yScale(58)]} annotAlign="center right" targetAlign="top center" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
            <AnnotArrow annot={[xScale(40.5), yScale(19)]} target={[xScale(54), yScale(42)]} annotAlign="center right" targetAlign="bottom center" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
        </>
   );
};

const Cm2NaarDm2 = () => {
    return (
        <Drawing>
            <Cm2NaarDm2Child/>
        </Drawing>
   );
};
export default Cm2NaarDm2;
