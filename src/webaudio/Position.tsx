import React from 'react';
import PositionModule from './modules/PositionModule';
import paramsFromProps from './paramsFromProps'
import './css/gain.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type PositionPropsType = {
    children?: any,
    coneInnerAngle?: number, //360
    coneOuterAngle?: number, //0
    coneOuterGain?: number, //0
    distanceModel?: string, //inverse   others: linear, exponential
    maxDistance?: number, //10000
    panningModel?: string, //equalpower or HRTF
    refDistance?: number, //1 
    rolloffFactor?: number, //1 depends on distanceModel: "linear" The range is 0 to 1. "inverse" The range is 0 to Infinity. "exponential" The range is 0 to Infinity.
    positionX?: number, 
    positionY?: number, 
    positionZ?: number, 
    orientationX?: number, 
    orientationY?: number, 
    orientationZ?: number
}

export default (props: PositionPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
        
    const [proxy] = React.useState(new PositionModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
        
    return (
        <parentContext.Provider value={proxy}>
            <div className="position">
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}