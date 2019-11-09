import React from 'react';

import ConstantModule from './classes/ConstantModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'

type ConstantPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    value: number

}

export default (props: ConstantPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new ConstantModule(
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
        <div className="gain">
            {children}
        </div>
    );
}