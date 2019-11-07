import React from 'react';

import renderChildren from './renderChildren'
  
import './css/gain.css'

type GainType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,
    registerAudioNode?: {(source: any): void}

    //component specific
    startValue: number,
    endValue: number,
    duration: number
}

export default (props: GainType) => {

    console.log('Render <Gain>');

    let children = null;

    if(props.context){
        
        let node: GainNode | null = null; 

        const proxy = {

            init: async () => {
                return new Promise((resolve)=>{
                    node = props.context!.createGain();
                    resolve();
                })
            },
            receive: (source: any) => {
                source.connect(node);
            },
            connect: async () => {
                return new Promise((resolve)=>{
                    props.target.receive(node)
                    resolve();
                })
            },
            trigger: async (time: number) => {

                if(!props.children){
                    return;
                }

                const count = props.children.length || 1;

                const attenuatedStart = count > 1 ? props.startValue / count : props.startValue;
                const attenuatedEnd = count > 1 ? props.endValue / count : props.endValue;

                node!.gain.setValueAtTime(attenuatedStart, time);
                node!.gain.exponentialRampToValueAtTime(attenuatedEnd, time + props.duration);
            }
        }
        
        props.registerAudioNode!(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy,
            registerAudioNode: props.registerAudioNode
        })   

    }

    
    return (
        <div className="gain">
            
            {children}

        </div>
    );
}