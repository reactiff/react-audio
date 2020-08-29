import React from 'react';
import RecorderModule from './modules/StreamRecorderModule';
import paramsFromProps from './paramsFromProps'
// import './css/recorder.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type StreamRecorderPropsType = {
    //standard props
    children?: any,
    //component specific
    pan?: number, //0 -1 to 1
}

// CHECK OUT THIS ARTICLE ABOUT CAPTURING STREAM FROM AUDIO TAG
// https://stackoverflow.com/questions/42336604/can-i-record-the-output-of-an-audio-without-use-of-the-microphone

export default (props: StreamRecorderPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const audioRef: any = React.createRef();
    const buttonRef: any = React.createRef();

    const [proxy] = React.useState(new RecorderModule(
        target,
        context,
        paramsFromProps(props, {audioRef: audioRef, buttonRef: buttonRef} )
    ));

    target.registerListener(proxy);
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="recorder">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}