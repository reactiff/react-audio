import React from 'react';

import ParamModule, {TransitionMethod} from './modules/ParamModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'

type ParamPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    name: string,
    
    min?: number,
    max?: number,

    value?: number,
    targetValue?: number,
    curve?: any[], 
    
    delay?: number,
    method?: TransitionMethod
    duration?: number,
}

const defaultValues = {
    method: TransitionMethod.Exponential,
}

export default (props: ParamPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new ParamModule(
            props.target,
            props.context,
            paramsFromProps(props, {}, defaultValues)
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