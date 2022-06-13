import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import useId from 'hooks/useId';


const _MlNaarDl = () => {
    const tellerId = useId();
    const noemerId = useId();
    const annotTellerId = useId();
    const annotNoemerId = useId();
    const {xScale, yScale} = React.useContext(DrawingContext);

    const annotTeller = String.raw`We komen van *milli-,* dus in de **teller** komt $\htmlId{${annotTellerId}}{\orange{10^{-3}}}$`;
    const annotNoemer = String.raw`We gaan naar *deci-,* dus in de **noemer** komt $\htmlId{${annotNoemerId}}{\blue{10^{-1}}}$`; 

    const breuk = String.raw`$$
1~\si{\orange{m}l} = \frac{\htmlId{${tellerId}}{\orange{10^{-3}}}}{\htmlId{${noemerId}}{\blue{10^{-1}}}}\si{\blue{d}l}
$$`;

    const fontSize = yScale.metric(4);
    const anchorRadius = yScale.metric(10);
    const anchorRadius2 = yScale.metric(20);

    return (
        <>
            <Annot x={xScale(40)} y={yScale(70)} fontSize={fontSize} width={xScale.metric(40)} align="bottom right">
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize={fontSize}>
                { breuk }
            </Annot>
            <Annot x={xScale(90)} y={yScale(30)} fontSize={fontSize} width={xScale.metric(40)} align="top right">
                { annotNoemer }
            </Annot>
            <AnnotArrow annot={[xScale(35.5), yScale(70.5)]} target={[xScale(51), yScale(56)]} annotAlign="bottom center" targetAlign="top left" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
            <AnnotArrow annot={[xScale(90), yScale(18)]} target={[xScale(60), yScale(44)]} annotAlign="top right" targetAlign="bottom right" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius2}/>
        </>
   );
};

const MlNaarDl = () => {
    return (
        <Drawing>
            <_MlNaarDl />
        </Drawing>
    )      
};
export default MlNaarDl;
