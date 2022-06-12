import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import _uniqueId from "lodash/uniqueId";


const Cm2NaarDm2Child = () => {
    const [tellerId, setTellerId] = React.useState(null);
    const [noemerId, setNoemerId] = React.useState(null);
    const [annotTellerId, setAnnotTellerId] = React.useState(null);
    const [annotNoemerId, setAnnotNoemerId] = React.useState(null);
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

    React.useEffect(() => {
        setTellerId(_uniqueId("cm2NaarDm2_teller"));
        setNoemerId(_uniqueId("cm2NaarDm2_noemer"));
        setAnnotTellerId(_uniqueId("cm2NaarDm2_teller_annot"));
        setAnnotNoemerId(_uniqueId("cm2NaarDm2l_noemer_annot"));
    }, []);

    const fontSize = yScale.metric(4);
    const anchorRadius = yScale.metric(10);

    return (
        <>
            <AnnotArrow target={`#${tellerId}`} annot={`#${annotTellerId}`} annotAlign="center right" targetAlign="top center" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
            <AnnotArrow target={`#${noemerId}`} annot={`#${annotNoemerId}`} annotAlign="center right" targetAlign="bottom center" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
            <Annot x={xScale(40)} y={yScale(70)} fontSize={fontSize} width={xScale.metric(40)} align="bottom right">
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize={fontSize}>
                { breuk }
            </Annot>
            <Annot x={xScale(40)} y={yScale(40)} fontSize={fontSize} width={xScale.metric(40)} align="top right">
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
