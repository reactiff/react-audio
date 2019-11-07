import React from 'react';
import {useState, useEffect} from 'react'

import renderChildren from './renderChildren'

import './css/audiocontext.css'

export default (props: any) => {
    
    const [context, setContext] = useState<AudioContext | undefined>(undefined);

    useEffect(()=>{
        setContext(new AudioContext());
    }, [])
    
    const target = {
        receive: (source: any) => {
            source.connect(context!.destination);
        },
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

