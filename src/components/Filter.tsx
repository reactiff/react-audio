import React from 'react';

import FilterModule, {FilterType} from './classes/FilterModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'

type FilterPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    frequency?: number,
    detune?: number,
    Q?: number,
    gain?: number,

    type?: FilterType
    
}

export default (props: FilterPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new FilterModule(
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