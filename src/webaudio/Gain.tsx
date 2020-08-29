import _ from 'lodash';
import React from 'react';
import Mpg from '../mpg/Mpg';

import paramsFromProps from './paramsFromProps'
import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';
import Node from './NodeRenderer';

import GainModule from './modules/GainModule';
import './css/gain.css'

type GainPropsType = {
    children?: any,
    name?: string,
    value?: number,
    targetValue?: number,
    duration?: number,
    delay?: number,
    method?: string,
}

export default (props: GainPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new GainModule(
        target,
        context,
        paramsFromProps(props),
    ));

    target.registerSource(proxy);
    
    const node = {
        proxy,
        title: proxy.getShortDescription(),
        icon: <GainIcon proxy={proxy} />,
    };

    return <Node {...node}>{props.children}</Node>
}


const GainIcon = (props: any) => {
    return (
        <Mpg.div bgColor="black">
            {
                <svg height="40" width="40" style={{transform: 'scale(0.5)'}}>
                    <polyline points="0,40 40,0 40,40" style={{ fill: 'white', stroke: 'white', strokeWidth: 1 }} />
                </svg>    
            }
        </Mpg.div>
    );
}