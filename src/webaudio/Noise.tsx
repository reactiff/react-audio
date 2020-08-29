import React from 'react';
import NoiseModule from './modules/NoiseModule';
import paramsFromProps from './paramsFromProps'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type NoisePropsType = {
    children?: any,
    duration?: number,
    playbackRate?: number
}

export default (props: NoisePropsType) => {
   
    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
    
    const [proxy] = React.useState(new NoiseModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
   
    return (
        <parentContext.Provider value={proxy}>
            <div className="noise">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}