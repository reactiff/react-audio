import React, {ReactElement} from 'react';

import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import AudioSourceModule from './modules/AudioSourceModule';


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
        
        props.target.registerSource(proxy);

        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }

    return (
        <div className="audio-source">
           {children}
        </div>
        
    );
}