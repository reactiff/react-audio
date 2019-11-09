import React from 'react';
import {useState, useEffect} from 'react'

import renderChildren from './renderChildren'

import './css/audiocontext.css'

declare var AudioContext: any | null, webkitAudioContext: any; 

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

    useEffect(()=>{
        setContext(getAudioContext());
    }, [])
    
    const target = {
        receive: (source: any) => {

            const incoming = source.getEndPoints();

            let cnt=0;

            for(let endPoint of incoming){

                endPoint.connect(context!.destination);


                if(incoming.length > 1){
                    console.log('(connected) --- ' + source.getDescription() + ' [' + cnt + '] --- to ---> MASTER')
                }
                else{
                    console.log('(connected) --- ' + source.getDescription() + ' --- to ---> MASTER')
                }

                

                cnt++;

            }
            
            

        },
        
        registerSource: () => {}
    }

    let children = null;
    
    if(context){

        children = renderChildren(props.children, {
            context: context,
            target: target
        });
    }
    
    if(context){
        console.log('Render <AudioContext>');
    }
        

    return (
        <div className="audio-context">
            
            {children}

        </div>
    )

}

