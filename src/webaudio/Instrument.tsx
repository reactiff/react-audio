import React, { useState, useEffect, useRef, useMemo } from 'react';
// import AudioNode from './AudioNode'
import renderChildren from './renderChildren'
import './css/instrument.css'
import AudioGraphInstrumentModule from './modules/InstrumentModule';

export default (props: any) => {

    if(!props.context){
        return null
    }

    const proxy = useRef<AudioGraphInstrumentModule>(new AudioGraphInstrumentModule(
        props.target,
        props.context,
        {
            name: props.name || 'Unnamed instrument',
            signalSource: props.signalSource,
            autoRelease: props.autoRelease,
            duration: props.duration,
            trackIndex: props.trackIndex,
            trackName: props.trackName,
            chromatic: typeof props.chromatic === 'undefined' ? true : props.chromatic,
            octave: props.octave || 4,
        }
    ));

    proxy.current.binding = props.binding;
    proxy.current.autoRelease = props.autoRelease;

    useEffect(()=>{
        
        //register as Instrument with Transport
        if(props.target.findParent){
            const transport = props.target.findParent('Transport');
            if (transport) {
                transport.registerInstrument(proxy.current);
            }
        }

        if(props.registerInstrument) {
            props.registerInstrument(proxy.current);
        }

        //register as Source
        props.target.registerSource(proxy.current);


    },[]);
    
    let triggerButton = null;
    let triggerKey = null;

    const trigger = (e: any)=> {

        props.context.resume();
        proxy.current.trigger()

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

    const children: any = useMemo(() => renderChildren(props.children, {
        context: props.context,
        target: proxy.current
    }), [])

    return <div className="instrument flex row tight">
        {children}
        {triggerButton}
    </div>
        
    
}