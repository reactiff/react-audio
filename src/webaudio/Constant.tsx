import _ from 'lodash';
import React from 'react';
import Mpg from '../mpg/Mpg';

import paramsFromProps from './paramsFromProps'
import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';
import Node from './NodeRenderer';

import ConstantModule from './modules/ConstantModule';

type ConstantPropsType = {
    children?: any,
    value: number
}

export default (props: ConstantPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new ConstantModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
    
    const node = {
        proxy,
        title: proxy.getShortDescription(),
    };

    return <Node {...node}>{props.children}</Node>
}