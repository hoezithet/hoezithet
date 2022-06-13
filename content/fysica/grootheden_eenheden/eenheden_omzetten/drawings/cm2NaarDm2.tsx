import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import useId from 'hooks/useId';


const Cm2NaarDm2Child = () => {
    const tellerId = useId();
    const noemerId = useId();
    const annotTellerId = useId();
    const annotNoemerId = useId();
    const {xScale, yScale} = React.useContext(DrawingContext);
 

    const annotTeller = String.raw`
We komen van *centi-* met een exponent $\orange{2},$ dus in de **teller** komt $\htmlId{${annotTellerId}}{\orange{\left(10^{-2}\right)^{\! 2}}}$`;

    const annotNoemer = String.raw`
We gaan naar *deci-* met een exponent $\blue{2},$ dus in de **noemer** komt $\htmlId{${annotNoemerId}}{\blue{\left(10^{-1}\right)^{\! 2}}}$
`;

    const breuk = String.raw`
$$
1~\si{\orange{c}m}^{\orange{2}} = \frac{\htmlId{${tellerId}}{\orange{\left(10^{-2}\right)^{\!2}}}}{\htmlId{${noemerId}}{\blue{\left(10^{-1}\right)^{\!2}}}}~\si{\blue{d}m}^{\blue{2}}
$$
`;

    const fontSize = yScale.metric(4);
    const anchorRadius = yScale.metric(10);

    return (
        <>
            <Annot x={xScale(40)} y={yScale(70)} fontSize={fontSize} width={xScale.metric(40)} align="bottom right">
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize={fontSize}>
                { breuk }
            </Annot>
            <Annot x={xScale(40)} y={yScale(40)} fontSize={fontSize} width={xScale.metric(40)} align="top right">
                { annotNoemer }
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
