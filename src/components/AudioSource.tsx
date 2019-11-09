import React, {ReactElement} from 'react';

import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import AudioSourceModule from './classes/AudioSourceModule';


import './css/audiofile.css'

type PropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //specific
    src: string
    name?: string
    controls?: boolean
    autoplay?: boolean
}
  
export default (props: PropsType) => {

    let children = null;

    let element: ReactElement | null = null;
    
    let proxy: AudioSourceModule | null = null;

    if(props.context){
    
        const elementRef: any = React.createRef();

        proxy = new AudioSourceModule(
            props.target,
            props.context,
            paramsFromProps(props, {elementRef: elementRef})
        );

        element = (
            <audio
                ref={elementRef} 
                className="audio-file"
                controls={props.controls}            
                
                src={props.src}>
                    Your browser does not support the
                    <code>audio</code> element.
            </audio>
        )

        props.target.registerSource(proxy);

        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }

    return (
        <div>
            {element}

            {children}
        </div>
        
    );
}