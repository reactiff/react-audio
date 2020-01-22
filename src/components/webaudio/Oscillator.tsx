import React from 'react';

import OscillatorModule from './modules/OscillatorModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/oscillator.css'
import Mpg from '../mpg/Mpg';

type OscillatorType = {

    children?: any,
    context?: AudioContext,
    target?: any,


    type: any,
    frequency?: any,
    prime?: boolean,
    duration?: number,

    wave?: any,

    id?: string
}

export default (props: OscillatorType) => {
   
    let children = null;

    if(props.context){
        
        const proxy = new OscillatorModule(
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
        <Mpg.Flex className="oscillator" row padded noMargin>

            <Mpg.div bgColor="black">
                {
                    props.type==='sine' &&
                    <svg width="40" height="40"  style={{transform: 'scale(0.5)'}}>
                        <path d="M 0 20 C 10 0, 15 0, 20 20 S 30 40, 40 20" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }}/>
                    </svg>
                }
                {
                    props.type==='square' &&
                    <svg height="40" width="40" style={{transform: 'scale(0.5)'}}>
                        <polyline points="0,40 10,40 10,0 30,0 30,40 40,40" style={{ fill: 'black', stroke: 'white', strokeWidth: 2 }} />
                    </svg>    
                }
                
            </Mpg.div>

            <Mpg.div>
                {
                    <h2>
                        {
                            props.frequency &&
                            !props.prime &&
                            props.frequency.toFixed(1)
                        }
                        {
                            props.frequency &&
                            props.prime &&
                            props.frequency.toFixed(0)
                        }
                        <small>
                            &nbsp;Hz
                            {
                                props.prime &&
                                <span>&nbsp;(prime)</span>
                            }
                        </small>
                    </h2>
                }
            </Mpg.div>

            

            <Mpg.div grow>
                {children}
            </Mpg.div>
            
        </Mpg.Flex>
    );
}