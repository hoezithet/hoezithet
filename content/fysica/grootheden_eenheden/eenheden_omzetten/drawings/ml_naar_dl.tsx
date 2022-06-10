import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import _uniqueId from "lodash/uniqueId";


const _MlNaarDl = () => {
    const [tellerId, setTellerId] = React.useState(null);
    const [noemerId, setNoemerId] = React.useState(null);
    const [annotTellerId, setAnnotTellerId] = React.useState(null);
    const [annotNoemerId, setAnnotNoemerId] = React.useState(null);
    const {xScale, yScale} = React.useContext(DrawingContext);

    const annotTeller = String.raw`We komen van *milli-,* dus in de **teller** komt $\htmlId{${annotTellerId}}{\orange{10^{-3}}}$`;
    const annotNoemer = String.raw`We gaan naar *deci-,* dus in de **noemer** komt $\htmlId{${annotNoemerId}}{\blue{10^{-1}}}$`; 

    const breuk = String.raw`$$
1~\si{\orange{m}l} = \frac{\htmlId{${tellerId}}{\orange{10^{-3}}}}{\htmlId{${noemerId}}{\blue{10^{-1}}}}\si{\blue{d}l}
$$`;

    const annotTellerReadyRef = React.useRef(false);
    const annotNoemerReadyRef = React.useRef(false);
    const breukReadyRef = React.useRef(false);
    const [isArrowDrawn, setIsArrowDrawn] = React.useState(false);

    const buildOnComplete = (ref) => () => {
        ref.current = true;
        if (annotTellerReadyRef.current
            && annotNoemerReadyRef.current
            && breukReadyRef.current
            && !isArrowDrawn) {
                setIsArrowDrawn(true);
        }
    };

    React.useEffect(() => {
        setTellerId(_uniqueId("mlNaarDl_teller"));
        setNoemerId(_uniqueId("mlNaarDl_noemer"));
        setAnnotTellerId(_uniqueId("mlNaarDl_teller_annot"));
        setAnnotNoemerId(_uniqueId("mlNaarDl_noemer_annot"));
    }, []);

    const fontSize = yScale.metric(4);
    const anchorRadius = yScale.metric(10);
    const anchorRadius2 = yScale.metric(20);

    return (
        <>
            <Annot x={xScale(40)} y={yScale(70)} fontSize={fontSize} width={xScale.metric(40)} align="bottom right"
                onComplete={buildOnComplete(annotTellerReadyRef)}>
                { annotTeller }
            </Annot>
            <Annot x={xScale(50)} y={yScale(50)} fontSize={fontSize}
                onComplete={buildOnComplete(breukReadyRef)}>
                { breuk }
            </Annot>
            <Annot x={xScale(90)} y={yScale(30)} fontSize={fontSize} width={xScale.metric(40)} align="top right"
                onComplete={buildOnComplete(annotNoemerReadyRef)}>
                { annotNoemer }
            </Annot>
            { isArrowDrawn ?
              <>
                <AnnotArrow target={`#${tellerId}`} annot={`#${annotTellerId}`} annotAlign="bottom center" targetAlign="top left" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius}/>
                <AnnotArrow target={`#${noemerId}`} annot={`#${annotNoemerId}`} annotAlign="top right" targetAlign="bottom right" anchorRadiusTarget={anchorRadius} anchorRadiusAnnot={anchorRadius2}/>
              </>
              : null }
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