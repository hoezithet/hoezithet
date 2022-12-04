import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';


const [annFxWidth, annFxHeight] = [1920, 750];
const AnnotatedFxChild = withDrawingScale(({
  annotFontSize, fxFontSize, m, q, xName, yName, mName, qName
}) => {
    const yId = useId();
    const xId = useId();
    const mId = useId();
    const qId = useId();
    const yNameId = useId();
    const xNameId = useId();
    const mNameId = useId();
    const qNameId = useId();
    const fx = String.raw`$\htmlId{${yId}}{\orange{y}} = \htmlId{${mId}}{\blue{${m}}} \htmlId{${xId}}{\orange{x}}` + (q !== null ? String.raw` + \htmlId{${qId}}{\blue{${q}}}$` : '');

    const [arrows, setArrows] = React.useState([]);

    const [xMargin, yMargin] = [50, 0];

    const arrowStyleProps = {lineWidth: 10, anchorRadius: 75, marginTarget: 50};

    const [fxX, fxY] = [annFxWidth/2, annFxHeight/2];

    React.useEffect(() => {
        setArrows([
            <AnnotArrow annot={`#${xNameId}`} target={`#${xId}`} {...{...arrowStyleProps, targetAlign: "bottom center", annotAlign: "top center"}} color="orange" />,
            <AnnotArrow annot={`#${yNameId}`} target={`#${yId}`} {...{...arrowStyleProps, targetAlign: "bottom center", annotAlign: "top center"}} color="orange" />,
            qName !== null ? <AnnotArrow annot={`#${qNameId}`} target={`#${qId}`} {...{...arrowStyleProps, targetAlign: "top center", annotAlign: "bottom center"}} color="blue"/> : null,
            mName !== null ? <AnnotArrow annot={`#${mNameId}`} target={`#${mId}`} {...{...arrowStyleProps, targetAlign: "top center", annotAlign: "bottom center"}} color="blue"/> : null,
        ]);
    }, []);

    return (
        <>
            { mName !== null ? <Annot x={fxX - xMargin} y={yMargin} fontSize={annotFontSize} align="top right" id={mNameId} color="blue">
                { mName }
            </Annot> : null }
            { qName !== null ? <Annot x={fxX + xMargin} y={yMargin} fontSize={annotFontSize} align="top left" id={qNameId} color="blue">
                { qName }
                </Annot> : null }
            <Annot x={fxX} y={fxY} fontSize={fxFontSize} align="center center">
                { fx }
            </Annot>
            <Annot x={fxX - xMargin} y={annFxHeight - yMargin} fontSize={annotFontSize} align="bottom right" id={yNameId} color="orange">
                { yName }
            </Annot>
            <Annot x={fxX + xMargin} y={annFxHeight - yMargin} fontSize={annotFontSize} align="bottom left" id={xNameId} color="orange">
                { xName }
            </Annot>
            { arrows }
        </>
    )
}, annFxWidth, annFxHeight)

export const AnnotatedFx = ({
  m, q, xName, yName, mName=null, qName=null,
  annotFontSize=75, fxFontSize=150
}) => {
    return (
        <Drawing left={0} right={annFxWidth} bottom={annFxHeight} top={0} noWatermark>
            {/** <DrawingGrid major={100} minor={50}/> **/}
            <AnnotatedFxChild m={m} q={q} xName={xName} yName={yName} mName={mName} qName={qName} annotFontSize={annotFontSize} fxFontSize={fxFontSize}/>
        </Drawing>
  );
};
