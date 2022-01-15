import React from "react";
import { Drawing } from "components/shortcodes/drawing";
import DrawingGrid from "components/shortcodes/drawingGrid";
import { SvgNote } from "components/shortcodes/svgNote";
import { AnnotArrow } from "components/shortcodes/annot";
import _ from "lodash";


const Cm2NaarDm2 = () => {
    const [tellerId] = React.useState("teller_dm2");
    const [noemerId] = React.useState("noemer_cm2");
    const [expId] = React.useState("exp_cm2dm2");
    
    const annotTeller = String.raw`
We komen van *centi-* met een exponent $\orange{2}$, dus in de **teller** komt $\htmlId{teller_annot_cm2}{\orange{\left(10^{-2}\right)^{\! 2}}}$`;

    const annotNoemer = String.raw`
We gaan naar *deci-* met een exponent $\blue{2}$, dus in de **noemer** komt $\htmlId{noemer_annot_dm2}{\blue{\left(10^{-1}\right)^{\! 2}}}$
`;

    const breuk = String.raw`
$$
1~\si{\orange{c}m}^\orange{2} = \frac{\htmlId{${tellerId}}{\orange{\left(10^{-2}\right)^{\!2}}}}{\htmlId{${noemerId}}{\blue{\left(10^{-1}\right)^{\!2}}}}~\si{\blue{d}m}^\blue{2}
$$
`; 

    return (
        <Drawing>
            <AnnotArrow target={`#${tellerId}`} annot="#teller_annot_cm2" hAlignAnnot="right" vAlignAnnot="center" hAlignTarget="center" vAlignTarget="top" />
            <AnnotArrow target={`#${noemerId}`} annot="#noemer_annot_dm2" hAlignAnnot="right" vAlignAnnot="center" hAlignTarget="center" vAlignTarget="bottom" />
            <SvgNote x="40" y="70" fontSize={14} width="40" hAlign="right" vAlign="bottom">
                { annotTeller }
            </SvgNote>
            <SvgNote x="50" y="50" fontSize={20}>
                { breuk }
            </SvgNote>
            <SvgNote x="40" y="40" fontSize={14} width="40" hAlign="right" vAlign="top">
                { annotNoemer }
            </SvgNote>
        </Drawing>
   );
};

export default Cm2NaarDm2;
