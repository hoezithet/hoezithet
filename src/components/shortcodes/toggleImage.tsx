import React, { useState } from "react";

interface ToggleImageProps {
    children: {
        props: {
            children: (JSX.Element|string)[];
        };
    };
    toggleText: string;
}

export const ToggleImage = ({children, toggleText}: ToggleImageProps) => {
    const [state, setState] = useState({ toggled: false });
    const imgs = children.props.children.filter(c => c !== "\n")
    const img1 = imgs[0];
    const img2 = imgs[1];

    return (
        <div>
          { state.toggled ? img2 : img1 }
          <span onClick={e => setState({ toggled: e.target.checked })}>{ toggleText }</span>
        </div>
    );
}

export const ToggleImageBare = ({children, toggleText}: ToggleImageProps) => {
    const imgs = children.props.children.filter(c => c !== "\n")
    const img = imgs[1];

    return (
        <div>
            { img }
            <span>{ toggleText }</span>
        </div>
    );
}