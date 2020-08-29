import React from 'react';
import {FeedbackReturnModule} from './modules/FeedbackModule';
import paramsFromProps from './paramsFromProps'
import './css/gain.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type FeedbackReturnPropsType = {
    children?: any,
    for?: string
}
const FeedbackReturn = (props: FeedbackReturnPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const proxy = new FeedbackReturnModule(
        target,
        context,
        paramsFromProps(props)
    );

    const parent = target.findParentByTypeAndName('Feedback', props.for);
    parent.registerReturnNode(proxy);
    target.registerSource(proxy);

    return (
        <parentContext.Provider value={proxy}>
            <div className="feedback-return">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}

export default FeedbackReturn;