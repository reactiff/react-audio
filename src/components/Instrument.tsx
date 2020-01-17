import React, { useState } from 'react';
import AudioNode from './webaudio/AudioNode'
import renderChildren from './webaudio/renderChildren'
import './css/instrument.css'
import AudioGraphInstrumentModule from './webaudio/modules/InstrumentModule';



export default (props: any) => {
    

    let children = null;

    let proxy: AudioGraphInstrumentModule | null = null;

    let title: string = '';

    if(props.context) { 
    
        title = props.name || 'Unnamed instrument';
        
        proxy = new AudioGraphInstrumentModule(
            props.target,
            props.context,
            {
                name: title,
                signalSource: props.signalSource,
                autoRelease: props.autoRelease,
                duration: props.duration,
            }
        );

        proxy.binding = props.binding;
        proxy.autoRelease = props.autoRelease;

        //register as Instrument with Transport
        if(props.target.findParent){
            const parent = props.target.findParent('Transport');
            parent.registerInstrument(proxy);
        }
        
        //register as Source
        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    let triggerButton = null;
    let triggerKey = null;

    const trigger = (e: any)=> {

        proxy!.trigger()

    }

    if(props.context) {

         triggerButton = (
            <div key="-1" className="trigger">
                <div className="buttons">
                    <div className="button play" onMouseDown={trigger}></div>
                </div>
            </div>
        )

    }

    return (

        <AudioNode>
            <div className="instrument">
                {title}
                {triggerKey}
                {triggerButton}
                {children}
            </div>
        </AudioNode>
    )
}