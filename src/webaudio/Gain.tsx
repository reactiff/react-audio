import React from 'react';

import AudioGraphGainModule from './modules/GainModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'
import Mpg from '../mpg/Mpg';

type GainPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    name?: string,
    value?: number,
    targetValue?: number,
    duration?: number,

    delay?: number
}

export default (props: GainPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new AudioGraphGainModule(
            props.target,
            props.context,
            paramsFromProps(props),
        );

        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <Mpg.Flex className="gain" row padded>
            <Mpg.Flex column tight>
                <small>GAIN</small>
                <Mpg.Flex row tight justifyContent="center">
                    <Mpg.div>{props.value}</Mpg.div>
                </Mpg.Flex>
            </Mpg.Flex>
            {children}
        </Mpg.Flex>
    );
}