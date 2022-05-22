import React from "react";
import { Drawing, DrawingContext } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { Annot } from "components/shortcodes/annot";
import { AnnotArrow } from "components/shortcodes/annotArrow";
import _uniqueId from "lodash/uniqueId";


const Cm2NaarDm2Child = () => {
    const [tellerId] = React.useState(_uniqueId("teller_dm2")) ;
    const [noemerId] = React.useState(_uniqueId("noemer_cm2"));
    const [expId] = React.useState(_uniqueId("exp_cm2dm2"));
    const {xScale, yScale} = React.useContext(DrawingContext);
    
    const annotTeller = String.raw`
We komen van *centi-* met een exponent $\orange{2},$ dus in de **teller** komt $\htmlId{teller_annot_cm2}{\orange{\left(10^{-2}\right)^{\! 2}}}$`;

    const annotNoemer = String.raw`
We gaan naar *deci-* met een exponent $\blue{2},$ dus in de **noemer** komt $\htmlId{noemer_annot_dm2}{\blue{\left(10^{-1}\right)^{\! 2}}}$
`;

    const breuk = String.raw`
$$
1~\si{\orange{c}m}^{\orange{2}} = \frac{\htmlId{${tellerId}}{\orange{\left(10^{-2}\right)^{\!2}}}}{\htmlId{${noemerId}}{\blue{\left(10^{-1}\right)^{\!2}}}}~\si{\blue{d}m}^{\blue{2}}
$$
`;

    return (
        <>
            <AnnotArrow target={`#${tellerId}`} annot="#teller_annot_cm2" hAlignAnnot="right" vAlignAnnot="center" hAlignTarget="center" vAlignTarget="top" />
            <AnnotArrow target={`#${noemerId}`} annot="#noemer_annot_dm2" hAlignAnnot="right" vAlignAnnot="center" hAlignTarget="center" vAlignTarget="bottom" />
            <Annot x={xScale(40)} y={yScale(70)} fontSize="1rem" width={xScale.metric(40)} hAlign="right" vAlign="bottom">
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize="1.5rem">
                { breuk }
            </Annot>
            <Annot x={xScale(40)} y={yScale(40)} fontSize="1rem" width={xScale.metric(40)} hAlign="right" vAlign="top">
                { annotNoemer }
            </Annot>
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
