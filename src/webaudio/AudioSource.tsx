import React, {ReactElement} from 'react';
import paramsFromProps from './paramsFromProps'
import AudioSourceModule from './modules/AudioSourceModule';
import './css/audiofile.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type PropsType = {
    children?: any,
    context?: AudioContext,
    target?: any,
    src: string
    name?: string
    controls?: boolean
    autoplay?: boolean
}
  
export default (props: PropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
    const [proxy] = React.useState(new AudioSourceModule(
        target,
        context,
        paramsFromProps(props, {})
    ));
    
    target.registerSource(proxy);
 
    return (
        <parentContext.Provider value={proxy}>
            <div className="audio-source">
                {props.children}
            </div>
        </parentContext.Provider>
    );
}