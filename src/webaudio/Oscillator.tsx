import _ from 'lodash';
import React from 'react';
import Mpg from '../mpg/Mpg';

import paramsFromProps from './paramsFromProps'
import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';
import Node from './NodeRenderer';

import OscillatorModule from './modules/OscillatorModule';
import './css/oscillator.css'

type OscillatorType = {
    children?: any,
    purpose?: string,
    type?: any,
    frequency?: any,
    prime?: boolean,
    polyphonic?: boolean,
    duration?: number,
    delay?: number,
    wave?: any,
    id?: string,
    random?: boolean,
    sine?: boolean,
    sawtooth?: boolean,
    square?: boolean,
    triangle?: boolean,
    binding?: string,
}

export default (props: OscillatorType) => {
   
    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new OscillatorModule(
        target,
        context,
        paramsFromProps(
            props, 
            {}, 
            {}, 
        )
    ));

    target.registerSource(proxy);

    const node = {
        proxy,
        title: proxy.getShortDescription(),
        icon: <OscillatorIcon proxy={proxy} />,
    };

    return <Node {...node}>{props.children}</Node>
}

const OscillatorIcon = (props: any) => {

    return (
        <Mpg.div className="oscillator-icon">
            {
                props.proxy.$params.type === 'sine' &&
                <svg width="20" height="20" style={{backgroundColor: 'black'}}>
                    <path d="M 0 10 C 3 0, 7 0, 10 10 S 15 20, 20 10" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }}/>
                </svg>
            }
            {
                props.proxy.$params.type === 'square' &&
                <svg height="40" width="40" style={{transform: 'scale(0.5)'}}>
                    <polyline points="0,40 10,40 10,0 30,0 30,40 40,40" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }} />
                </svg>    
            }
            {
                props.proxy.$params.type === 'triangle' &&
                <svg height="40" width="40" style={{transform: 'scale(0.5)'}}>
                    <polyline points="0,40 20,0 40,40" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }} />
                </svg>    
            }
            {
                props.proxy.$params.type === 'sawtooth' &&
                <svg height="40" width="40" style={{transform: 'scale(0.5)'}}>
                    <polyline points="0,40 40,0 40,40" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }} />
                </svg>    
            }
        </Mpg.div>

        // <Mpg.div>
        // {
        //     <h2>
        //         <small>
        //             &nbsp;Hz
        //             {
        //                 props.prime &&
        //                 <span>&nbsp;(prime)</span>
        //             }
        //         </small>
        //     </h2>
        // }
        // </Mpg.div>
    );
}