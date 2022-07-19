import React from 'react';


const AnimationContext = React.createContext({
    addAnimation: (child, position) => {},
});


export default AnimationContext;