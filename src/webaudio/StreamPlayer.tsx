import React from 'react';

import StreamPlayerModule from './modules/StreamPlayerModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import Mpg from '../mpg/Mpg';

type StreamPlayerPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,
    
    deviceId?: any,
}

export default (props: StreamPlayerPropsType) => {

    let children = null;

    if(props.context && props.deviceId){
                
        const params = paramsFromProps(props, {
            // audioRef: audioRef, 
            // buttonRef: buttonRef,
            deviceId: props.deviceId,
        });

        const proxy = new StreamPlayerModule(
            props.target,
            props.context,
            params,
        );

        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        });

    }
    
    return (
        <div className="stream-player fill">
            {children}
        </div>
    );
}