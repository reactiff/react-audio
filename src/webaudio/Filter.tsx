import React from 'react';
import FilterModule, {FilterType} from './modules/FilterModule';
import paramsFromProps from './paramsFromProps'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type FilterPropsType = {
    //standard props
    children?: any,
    //component specific
    frequency?: number,
    detune?: number,
    Q?: number,
    gain?: number,
    type?: FilterType
    off?: boolean
}

export default (props: FilterPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new FilterModule(
        target,
        context,
        paramsFromProps(props)
    ));


    target.registerSource(proxy);
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="filter">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}