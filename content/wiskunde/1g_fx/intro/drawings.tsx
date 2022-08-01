import React from "react";
import { Drawing, DrawingContext } from "components/drawings/drawing";
import DrawingGrid from "components/drawings/drawingGrid";
import { Annot } from "components/drawings/annot";
import { AnnotArrow } from "components/drawings/annotArrow";
import withDrawingScale from "components/withDrawingScale";
import useId from 'hooks/useId';


const [annFxWidth, annFxHeight] = [1920, 1080];
const AnnotatedFxChild = withDrawingScale(({
  fontSize=100, m, q, xName, yName
}) => {
    const yId = useId();
    const xId = useId();
    const yNameId = useId();
    const xNameId = useId();
    const fx = String.raw`$\htmlId{${yId}}{\green{y}} = ${m}\cdot \htmlId{${xId}}{\orange{x}} + ${q}$`;
    const xAnnot = String.raw`$\htmlId{${xNameId}}{\orange{\text{${xName}}}}$`;
    const yAnnot = String.raw`$\htmlId{${yNameId}}{\green{\text{${yName}}}}$`;

    const [arrows, setArrows] = React.useState([]);

    const [xMargin, yMargin] = [200, 100];

    const arrowStyleProps = {lineWidth: 10, anchorRadius: 150, margin: 50, targetAlign: "bottom center"};

    React.useEffect(() => {
        setArrows([
            <AnnotArrow annot={`#${xNameId}`} target={`#${xId}`} {...arrowStyleProps} />,
            <AnnotArrow annot={`#${yNameId}`} target={`#${yId}`} {...arrowStyleProps} />
        ]);
    }, []);

    return (
        <>
            <Annot x={annFxWidth - xMargin} y={annFxHeight - yMargin} fontSize={fontSize} align="bottom right" width={annFxWidth}>
                { xAnnot }
            </Annot>
            <Annot x={xMargin} y={annFxHeight - yMargin} fontSize={fontSize} align="bottom left">
                { yAnnot }
            </Annot>
            <Annot x={annFxWidth/2} y={annFxHeight/2} fontSize={1.5*fontSize} align="center center">
                { fx }
            </Annot>
            { arrows }
        </>
    )
}, annFxWidth, annFxHeight)

export const AnnotatedFx = ({
  m, q, xName, yName
}) => {
    return (
        <Drawing left={0} right={1920.0} bottom={1080.0} top={0} noWatermark>
            { /** <DrawingGrid major={100} minor={50}/> **/}
            <AnnotatedFxChild m={m} q={q} xName={xName} yName={yName} />
        </Drawing>
    );
  };
