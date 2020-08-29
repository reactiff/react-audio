import React from 'react';
import DelayModule from './modules/DelayModule';
import paramsFromProps from './paramsFromProps'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type DelayPropsType = {
    children?: any,
    delayTime?: number,
}

export default (props: DelayPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new DelayModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);

    return (
        <parentContext.Provider value={proxy}>
            <div className="delay">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}