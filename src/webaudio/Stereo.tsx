import React from 'react';
import StereoModule from './modules/StereoModule';
import paramsFromProps from './paramsFromProps'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type StereoPropsType = {
    children?: any,
    pan?: number, //0 -1 to 1
}

export default (props: StereoPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new StereoModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="stereo">
                {props.children}
            </div>    
        </parentContext.Provider>
        
    );
}