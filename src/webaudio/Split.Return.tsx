import React from 'react';
import {SplitReturnModule} from './modules/SplitModule';
import paramsFromProps from './paramsFromProps'
import './css/gain.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type ReturnPropsType = {
    children?: any,
}
const SplitReturn = (props: ReturnPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new SplitReturnModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerReturnNode(proxy);
    target.registerSource(proxy);
        
    return (
        <parentContext.Provider value={proxy}>
            <div className="split-return">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}

export default SplitReturn;