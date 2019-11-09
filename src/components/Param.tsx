import React from 'react';

import ParamModule, {TransitionMethod} from './classes/ParamModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'



type ParamPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    for: string,
    
    value?: number,
    targetValue?: number,
    curve?: any[], 
    
    delay?: number,
    method?: TransitionMethod
    duration?: number,
}

export default (props: ParamPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new ParamModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        proxy.target.registerSource(proxy);

        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <div className="param">
            {children}
        </div>
    );
}