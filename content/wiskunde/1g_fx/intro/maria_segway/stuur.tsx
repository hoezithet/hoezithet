import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";


const _Stuur = () => {

    return (
        <g transform="translate(-321.724681 -138.301102)">
          <g transform="matrix(0.986111 0.166086 -0.166086 0.986111 50.156 -26.845)" ><path fill="none" stroke="#357edd" strokeWidth="7.9375" strokeLinecap="round" strokeLinejoin="miter" strokeDasharray="none" strokeOpacity="1" d="M 313.70807,227.48635 333.14209,111.36258"/><path fill="none" fillOpacity="0" stroke="#333333" strokeWidth="5.29167" strokeLinecap="round" strokeLinejoin="miter" strokeDasharray="none" strokeOpacity="1" d="m 333.14209,111.36258 c -3.54855,5.32662 -9.98994,5.73194 -16.29656,6.36649" /></g>
        </g>
    );
}

const Stuur = withSizePositionAngle(_Stuur, 38.450633, 111.283208);

export default Stuur;