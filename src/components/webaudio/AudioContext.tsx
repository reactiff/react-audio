import React from 'react';
import {useState, useEffect, useRef} from 'react'

import renderChildren from './renderChildren'

import Logger from './modules/Logger'

import './css/audiocontext.css'
import BaseAudioGraphNodeModule from './modules/BaseAudioGraphNodeModule';

declare var AudioContext: any | null, webkitAudioContext: any; 

const chromaKeys: any = {
    z: { state: 0, frequency: 261.63 }, 
    s: { state: 0, frequency: 277.18 }, 
    x: { state: 0, frequency: 293.66 }, 
    d: { state: 0, frequency: 311.13 }, 
    c: { state: 0, frequency: 329.63 }, 
    v: { state: 0, frequency: 349.23 }, 
    g: { state: 0, frequency: 369.99 }, 
    b: { state: 0, frequency: 392 }, 
    h: { state: 0, frequency: 415.3 }, 
    n: { state: 0, frequency: 440 }, 
    j: { state: 0, frequency: 466.16 }, 
    m: { state: 0, frequency: 493.88 }, 
}

function isChromaKey(key: string){
    return chromaKeys[key]
}
function getChromaFrequency(key: string){
    return chromaKeys[key].frequency
}


function getAudioContext() {

    if('webkitAudioContext' in window){
        return new webkitAudioContext();
    }
    else if('AudioContext' in window){
        return new AudioContext();
    }
    else{
        return { destination: {} }; // mock for testing
    }
    
}


export default (props: any) => {

    const [context, setContext] = useState<AudioContext | undefined>(undefined);
    
    const keyBindings = useRef<any>({})

    useEffect(()=>{

        setContext(getAudioContext());


        //keyboard bindings
        document.addEventListener('keydown', (event) => {
            if(!event.repeat){
                if(isChromaKey(event.key)){
                    if(keyBindings.current['chromatic']){
                        const f = getChromaFrequency(event.key)
                        keyBindings.current['chromatic'].trigger({frequency:f})    
                    }
                }
                else if(keyBindings.current.hasOwnProperty(event.key)){
                    keyBindings.current[event.key].trigger()
                }
            }
        }, false);

        document.addEventListener('keyup', (event) => {
            if(isChromaKey(event.key)){
                if(keyBindings.current['chromatic']){
                    const f = getChromaFrequency(event.key)
                    const activeInstrument = keyBindings.current['chromatic']
                    if(!activeInstrument.autoRelease){
                        activeInstrument.stop({frequency:f})
                    }
                }
            }
            else if(keyBindings.current.hasOwnProperty(event.key)){
                const activeInstrument = keyBindings.current[event.key]
                if(!activeInstrument.autoRelease){
                    activeInstrument.stop()
                }
            }
        }, false);
          
    }, [])
    
    const target = {

        receive: (source: any) => {
            const incoming = source.getEndPoints();
            let index=0;
            for(let endPoint of incoming){
                endPoint.connect(context!.destination);
                Logger.logConnection(source, index++, 'MASTER');
            }
        },

        passThrough(source: any) {
            const inputs = source.getEndPoints();
            let index=0;
            for(let endPoint of inputs){
                endPoint.connect(context!.destination);
                Logger.logConnection(source, index++, 'MASTER');
            }
        },
    
        registerSource(source: any) { },


        //passed through from any target registerSource
        registerBinding(source: any) {
            
            if(keyBindings.current.hasOwnProperty(source.binding)){
                throw new Error('Key ' + source.binding + ' is already bound')
            }

            keyBindings.current[source.binding] = source

        }


    }

    let children = null;
    
    if(context){
        children = renderChildren(props.children, {
            context: context,
            target: target
        });
    }
    
    // if(context){
    //     console.log('Render <AudioContext>');
    // }

    return (
        <div className="audio-context">
            
            {children}

        </div>
    )

}

