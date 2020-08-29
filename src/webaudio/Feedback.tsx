import React from 'react';
import FeedbackModule from './modules/FeedbackModule';
import paramsFromProps from './paramsFromProps'
import './css/gain.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type FeedbackPropsType = {
    children?: any,
    name?: string
}

export default (props: FeedbackPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new FeedbackModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
        
    return (
        <parentContext.Provider value={proxy}>
            <div className="feedback">
                {props.children}
            </div>    
        </parentContext.Provider>
        
    );
}
