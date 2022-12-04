import React from "react";
import withSizePositionAngle from "components/withSizePositionAngle";


const _Table = () => {

    return (
        <g transform="translate(-157.896570 -150.539457)">
          <g transform="translate(-3.175, -0.529167)" fill="#803300" stroke="none"><rect fill="#803300" stroke="none" strokeWidth="0.911655" stopColor="#000000" width="3.6821563" height="208.87289" x="-154.75078" y="-369.94446" transform="matrix(0 -1 -1 0 0 0)"/><g transform="translate(0.455797, 0)"><rect fill="#803300" stroke="none" strokeWidth="0.396875" stopColor="#000000" width="3.6821563" height="39.584846" x="347.77155" y="153.10814"/><rect fill="#803300" stroke="none" strokeWidth="0.396875" stopColor="#000000" width="3.6821563" height="39.584846" x="178.65073" y="153.63728"/></g></g>
        </g>
    );
}

const Table = withSizePositionAngle(_Table, 208.872890, 42.153502);

export default Table;