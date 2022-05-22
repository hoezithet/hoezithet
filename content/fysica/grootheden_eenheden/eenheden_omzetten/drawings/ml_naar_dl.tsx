import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { Annot } from "components/shortcodes/annot";
import { AnnotArrow } from "components/shortcodes/annotArrow";
import _uniqueId from "lodash/uniqueId";


const _MlNaarDl = () => {
    const [tellerId] = React.useState(_uniqueId("mlNaarDl_teller"));
    const [noemerId] = React.useState(_uniqueId("mlNaarDl_noemer"));
    const [annotTellerId] = React.useState(_uniqueId("mlNaarDl_teller_annot"));
    const [annotNoemerId] = React.useState(_uniqueId("mlNaarDl_noemer_annot"));
    const {xScale, yScale} = React.useContext(DrawingContext);

    const annotTeller = String.raw`We komen van *milli-,* dus in de **teller** komt $\htmlId{${annotTellerId}}{\orange{10^{-3}}}$`;
    const annotNoemer = String.raw`We gaan naar *deci-,* dus in de **noemer** komt $\htmlId{${annotNoemerId}}{\blue{10^{-1}}}$`; 

    const breuk = String.raw`$$
1~\si{\orange{m}l} = \frac{\htmlId{${tellerId}}{\orange{10^{-3}}}}{\htmlId{${noemerId}}{\blue{10^{-1}}}}\si{\blue{d}l}
$$`; 

    return (
        <>
            <AnnotArrow target={`#${tellerId}`} annot={`#${annotTellerId}`} hAlignAnnot="center" vAlignAnnot="bottom" hAlignTarget="left" vAlignTarget="top" />
            <AnnotArrow target={`#${noemerId}`} annot={`#${annotNoemerId}`} hAlignAnnot="left" vAlignAnnot="bottom" hAlignTarget="left" vAlignTarget="bottom" anchorRadiusTarget={40} anchorRadiusAnnot={60}/>
            <Annot x={xScale(40)} y={yScale(70)} fontSize="1rem" width={xScale.metric(40)} hAlign="right" vAlign="bottom">
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize="1.5rem">
                { breuk }
            </Annot>
            <Annot x={xScale(60)} y={yScale(30)} fontSize="1rem" width={xScale.metric(40)} hAlign="left" vAlign="top">
                { annotNoemer }
            </Annot>
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
