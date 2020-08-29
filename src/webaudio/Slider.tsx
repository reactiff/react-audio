import React, { ReactElement, RefObject } from 'react';
import {useState, useEffect, useRef} from 'react'
import SliderModule from './modules/SliderModule';
import paramsFromProps from './paramsFromProps'
import './css/slider.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type SliderType = {
    children?: any,
    title?: any ,
    targetParam: string,
    value: number,
    min: number,
    max: number,
    step: number,
    vertical?: boolean
}

const paramDefaults = {
    vertical: false
}

export default (props: SliderType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const inputRef = useRef(null);
    const [currentValue, setCurrentValue] = useState()
    
    const [proxy] = React.useState(new SliderModule(
        target,
        context,
        paramsFromProps(
            props, 
            {
                inputRef: inputRef, 
                setCurrentValue,
            }, 
            paramDefaults
        )
    ));

    target.registerSource(proxy);

    return (
        <parentContext.Provider value={proxy}>
            <div className="slider param">
                <div className="oled">{currentValue || 0}</div>
                <input 
                        ref={inputRef} 
                        type="range" 
                        defaultValue={props.value} 
                        value={currentValue}
                        min={props.min} 
                        max={props.max} 
                        step={props.step}
                        className={props.vertical ? 'vertical' : ''}
                    />
            </div>    
        </parentContext.Provider>
    );
}