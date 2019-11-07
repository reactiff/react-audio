import React, { useState } from 'react';

import AudioNode from './AudioNode'

import renderChildren from './renderChildren'

import './css/instrument.css'
  
export default (props: any) => {

    console.log('Render <Instrument>');

    let children = null;

    if(props.context) { 
    
        const sources:any[] = [];

        const registerAudioNode = (source: any)  => {
            sources.push(source);
        }
    
        const handleTrigger = async () => {

            console.log('Init, Connect, Trigger!');
   
            await Promise.all(sources.map(source => source.init()));
            await Promise.all(sources.map(source => source.connect()));

            const time  = props.context.currentTime;
            await Promise.all(sources.map(source => source.trigger(time)));

        }

        const triggerButton = (
            <div key="-1" className="trigger" onMouseDown={()=>handleTrigger()} >
                <div className="button play"></div>
            </div>
        )

        children = [triggerButton].concat(renderChildren(props.children, {
            context: props.context,
            target: props.target, // patch thru to parent 
            registerAudioNode: registerAudioNode
        }))
    }
    
    

    return (

        <AudioNode>

            <div className="instrument">
                
                {
                    children
                }
                
            </div>

        </AudioNode>
    )
}