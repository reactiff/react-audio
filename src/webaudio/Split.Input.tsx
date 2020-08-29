import React from 'react';
import {SplitInputModule} from './modules/SplitModule';
import paramsFromProps from './paramsFromProps'
import './css/gain.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type InputPropsType = {
    children?: any,
}
const SplitInput = (props: InputPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new SplitInputModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerInputNode(proxy);
    target.registerSource(proxy); 
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="split-input">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}

export default SplitInput;
