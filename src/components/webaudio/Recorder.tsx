import React from 'react';

import RecorderModule from './modules/RecorderModule';
import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

// import './css/recorder.css'


type RecorderPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    pan?: number, //0 -1 to 1
    
}

export default (props: RecorderPropsType) => {

    let children = null;

    if(props.context){
        
        const audioRef: any = React.createRef();
        const buttonRef: any = React.createRef();

        const params = paramsFromProps(props, {audioRef: audioRef, buttonRef: buttonRef} );

        const proxy = new RecorderModule(
            props.target,
            props.context,
            params
        );

        props.target.registerListener(proxy);
        
        children = (
            <>
                <audio ref={audioRef} className="recorder" controls></audio>
                <input ref={buttonRef} type="button" value="Record"/> 
            </>
        );
        

    }
    
    return (
        <div className="recorder">
            {children}
        </div>
    );
}