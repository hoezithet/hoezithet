import React from 'react';
import COLORS from "../colors";


const Paper = ({children}) => {
    return (
        <div className="root">
            { props.children }
            <style jsx>{`
                .root {
                    padding: 1rem;
                    margin: 0.5rem;
                    break-inside: avoid;
                    background-color: ${COLORS.WHITE};
                    border-radius: .5rem;
                    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
                }
            `}</style>
        </div>
    );
};

export default Paper;
