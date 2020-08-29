import React from 'react';
import DynamicCompressorModule from './modules/DynamicCompressorModule';
import paramsFromProps from './paramsFromProps';

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type DynamicCompressorPropsType = {
    children?: any,
    enabled?: boolean
}

export default (props: DynamicCompressorPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new DynamicCompressorModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="compressor">
                {props.children}
            </div>    
        </parentContext.Provider>
        
    );
}