import React from 'react';

import PositionModule from './modules/PositionModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'


type PositionPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    coneInnerAngle?: number, //360
    coneOuterAngle?: number, //0
    coneOuterGain?: number, //0
    distanceModel?: string, //inverse   others: linear, exponential
    maxDistance?: number, //10000
    panningModel?: string, //equalpower or HRTF
    refDistance?: number, //1 
    rolloffFactor?: number, //1 depends on distanceModel: "linear" The range is 0 to 1. "inverse" The range is 0 to Infinity. "exponential" The range is 0 to Infinity.

    positionX?: number, 
    positionY?: number, 
    positionZ?: number, 

    orientationX?: number, 
    orientationY?: number, 
    orientationZ?: number
}

export default (props: PositionPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new PositionModule(
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
        <div className="position">
            {children}
        </div>
    );
}