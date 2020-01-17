import React from 'react';

import StereoModule from './modules/StereoModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'


type StereoPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    pan?: number, //0 -1 to 1
    
}

export default (props: StereoPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new StereoModule(
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
        <div className="stereo">
            {children}
        </div>
    );
}