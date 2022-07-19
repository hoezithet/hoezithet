import React from "react" ;


export const getChildAtIndex = (children: React.ReactNode, index: number) => {
    const childArray = React.Children.toArray(children);
    return childArray[index];
};