import React from 'react';

import NoiseModule from './modules/NoiseModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

//import './css/oscillator.css'

type NoisePropsType = {

    children?: any,
    context?: AudioContext,
    target?: any,

    duration?: number,
    playbackRate?: number

}

export default (props: NoisePropsType) => {
   
    let children = null;

    if(props.context){
        
        const proxy = new NoiseModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <div className="noise">
            {children}
        </div>
    );
}