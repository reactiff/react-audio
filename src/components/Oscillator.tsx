import React from 'react';

import OscillatorModule from './classes/OscillatorModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/oscillator.css'

type OscillatorType = {

    children?: any,
    context?: AudioContext,
    target?: any,

    type: any,
    frequency: number,
    duration: number
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
        <div className="oscillator">
            {children}
        </div>
    );


    /*

    if(props.context){

        let audioEndpoint: OscillatorNode | null = null;
        
        let inputEndpoints:any[] = [];

        const params = {
            type: props.type,
            frequency: props.frequency,
            duration: props.duration
        };

        const getDescription = () => {
            return `${props.type}(${props.frequency}) ${props.duration}s`;
        }

        const oscillatorNode = {

            $type: 'OscillatorProxy',
            $params: params,

            getEndPoints: () => {
                if(audioEndpoint){
                    return [audioEndpoint];
                }
                else{
                    return inputEndpoints;
                }
            },

            init: async () => {
                return new Promise((resolve)=>{
                    audioEndpoint = props.context!.createOscillator();
                    audioEndpoint.type = props.type;
                    
                    console.log(getDescription() + ' initialized');

                    resolve();
                })
            },
            
            receive: (source: any) => {
                source.connect(oscillatorNode);
            },
            
            connect: async () => {
                return new Promise(async (resolve)=>{
                    await props.target.receive(oscillatorNode)
                    resolve();
                })
            },
            
            start: async (time: number) => {

                console.log(' (start) @' + time + ' : ' + getDescription());

                audioEndpoint!.frequency.setValueAtTime(props.frequency, time)
                audioEndpoint!.start(time);
                audioEndpoint!.stop(time + props.duration);
            },

            getDescription: getDescription
        }
    
        props.target.registerSource(oscillatorNode);
        
    }
    
    return (

        <div className="oscillator">
            {props.frequency}
        </div>

    );

    */
   
}