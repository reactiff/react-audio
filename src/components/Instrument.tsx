import React, { useState } from 'react';

import AudioNode from './AudioNode'

import renderChildren from './renderChildren'

import './css/instrument.css'
import AudioGraphInstrumentModule from './classes/InstrumentModule';
  
export default (props: any) => {

    // console.log('Render <Instrument>');

    let children = null;

    let proxy: AudioGraphInstrumentModule | null = null;

    if(props.context) { 
    
        proxy = new AudioGraphInstrumentModule(
            props.target,
            props.context,
            {
                name: props.name || 'Unnamed instrument'
            }
        );

        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    let triggerButton = null;

    if(props.context) {
         triggerButton = (
            <div key="-1" className="trigger" onMouseDown={()=> {
                //console.clear();

                proxy!.context.resume();

                proxy!.trigger();
            }}>
                <div className="button play"></div>
            </div>
        )
    }

    return (

        <AudioNode>

            <div className="instrument">
                
                {triggerButton}

                {children}
                
            </div>

        </AudioNode>
    )
}