import _ from 'lodash';
import React from 'react';
import Mpg from '../mpg/Mpg';

import paramsFromProps from './paramsFromProps'
import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';
import Node from './NodeRenderer';

import ParamModule from './modules/ParamModule';


type ParamPropsType = {
    children?: any,
    purpose?: string,
    name: string,
    min?: number,
    max?: number,
    value?: number,
    targetValue?: number,
    curve?: any[], 
    delay?: number,
    method?: string
    duration?: number,
}

export default (props: ParamPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new ParamModule(
        target,
        context,
        paramsFromProps(props, {})
    ));

    target.registerSource(proxy);
    
    const node = {
        proxy,
        title: proxy.getShortDescription(),
    };

    return <Node {...node}>{props.children}</Node>
}