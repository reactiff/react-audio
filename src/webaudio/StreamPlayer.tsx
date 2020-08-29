import React from 'react';
import StreamPlayerModule from './modules/StreamPlayerModule';
import paramsFromProps from './paramsFromProps'
import Mpg from '../mpg/Mpg';

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type StreamPlayerPropsType = {
    children?: any,
    deviceId?: any,
}

export default (props: StreamPlayerPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
                
    const [proxy] = React.useState(new StreamPlayerModule(
        target,
        context,
        paramsFromProps(
            props, 
            { deviceId: props.deviceId }
        ),
    ));

    target.registerSource(proxy);
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="stream-player fill">
                {props.children}
            </div>
        </parentContext.Provider>
    );
}