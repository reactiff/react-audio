import React from 'react';

import DelayModule from './modules/DelayModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

//import './css/delay.css'

type DelayPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    delayTime?: number,
}

export default (props: DelayPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new DelayModule(
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
        <div className="delay">
            {children}
        </div>
    );
}