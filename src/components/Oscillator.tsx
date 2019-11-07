import React from 'react';

import renderChildren from './renderChildren'
  
import './css/oscillator.css'

type OscillatorType = {

    children?: any,
    context?: AudioContext,
    target?: any,

    registerAudioNode?: {(source: any): void}

    type: any,
    frequency: number,
    duration: number
}

export default (props: OscillatorType) => {

    console.log('Render <Oscillator>');

    // The setup occurs when react component renders

    if(props.context){

        let oscillator: OscillatorNode | null = null;
        
        const oscillatorNode = {
            init: async () => {
                return new Promise((resolve)=>{
                    oscillator = props.context!.createOscillator();
                    oscillator.type = props.type;
                    resolve();
                })
            },
            receive: (source: any) => {
                source.connect(oscillator);
            },
            connect: async () => {
                return new Promise((resolve)=>{
                    props.target.receive(oscillator)
                    resolve();
                })
            },
            trigger: async (time: number) => {
                oscillator!.frequency.setValueAtTime(props.frequency, time)
                oscillator!.start(time);
                oscillator!.stop(time + props.duration);
            }
        }
    
        if(props.registerAudioNode){
            props.registerAudioNode(oscillatorNode);
        }
    }
    
    //Doesn't render anything ?
    return (
        <div className="oscillator">
            {props.frequency}
        </div>
    );
}