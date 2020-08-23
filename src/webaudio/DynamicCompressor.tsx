import React from 'react';

import DynamicCompressorModule from './modules/DynamicCompressorModule';
import renderChildren from './renderChildren';
import paramsFromProps from './paramsFromProps';

type DynamicCompressorPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    
    enabled?: boolean
}

export default (props: DynamicCompressorPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new DynamicCompressorModule(
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
        <div className="filter">
            {children}
        </div>
    );
}