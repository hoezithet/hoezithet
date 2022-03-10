import React from "react";
import { Drawing } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { SvgNote } from "components/shortcodes/svgNote";
import { AnnotArrow } from "components/shortcodes/annot";
import _uniqueId from "lodash/uniqueId";


const _MlNaarDl = () => {
    const [tellerId] = React.useState(_uniqueId("mlNaarDl_teller"));
    const [noemerId] = React.useState(_uniqueId("mlNaarDl_noemer"));
    const [annotTellerId] = React.useState(_uniqueId("mlNaarDl_teller_annot"));
    const [annotNoemerId] = React.useState(_uniqueId("mlNaarDl_noemer_annot"));
    
    const annotTeller = String.raw`We komen van *milli-*, dus in de **teller** komt $\htmlId{${annotTellerId}}{\orange{10^{-3}}}$`;
    const annotNoemer = String.raw`We gaan naar *deci-*, dus in de **noemer** komt $\htmlId{${annotNoemerId}}{\blue{10^{-1}}}$`; 

    const breuk = String.raw`$$
1~\si{\orange{m}l} = \frac{\htmlId{${tellerId}}{\orange{10^{-3}}}}{\htmlId{${noemerId}}{\blue{10^{-1}}}}\si{\blue{d}l}
$$`; 

    return (
        <>
            <AnnotArrow target={`#${tellerId}`} annot={`#${annotTellerId}`} hAlignAnnot="center" vAlignAnnot="bottom" hAlignTarget="left" vAlignTarget="top" />
            <AnnotArrow target={`#${noemerId}`} annot={`#${annotNoemerId}`} hAlignAnnot="left" vAlignAnnot="bottom" hAlignTarget="left" vAlignTarget="bottom" anchorRadiusTarget={40} anchorRadiusAnnot={60}/>
            <SvgNote x="40" y="70" fontSize={14} width="40" hAlign="right" vAlign="bottom">
                { annotTeller }
            </SvgNote>
            <SvgNote x="50" y="50" fontSize={20}>
                { breuk }
            </SvgNote>
            <SvgNote x="60" y="30" fontSize={14} width="40" hAlign="left" vAlign="top">
                { annotNoemer }
            </SvgNote>
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
