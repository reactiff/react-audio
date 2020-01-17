import React, { ReactElement, RefObject } from 'react';
import {useState, useEffect, useRef} from 'react'

import SliderModule from './modules/SliderModule';

import paramsFromProps from './paramsFromProps'
  
import './css/slider.css'

type SliderType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //title
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

    
    let control: ReactElement | null = null;
    
    const inputRef = useRef(null);

    const [currentValue, setCurrentValue] = useState(null)
    const [proxy, setProxy] =  useState<SliderModule | null>(null);

    useEffect(()=>{

        // if(props.context){
    
            
            const params = paramsFromProps(props, {inputRef: inputRef, setCurrentValue: setCurrentValue}, paramDefaults);
    
            
            const proxy = new SliderModule(
                props.target,
                props.context,
                params
            );
    
            proxy.target.registerSource(proxy);

            setProxy(proxy);
    
        // }

    },[])

    if(!proxy){
        return null;
    }

    return (
        <div className="slider param">
            
            <div className="oled">{currentValue || 0}</div>
            
            <input 
                    ref={inputRef} 
                    type="range" 
                    defaultValue={proxy!.$params.value} 
                    min={proxy!.$params.min} 
                    max={proxy!.$params.max} 
                    step={proxy!.$params.step}
                    className={proxy!.$params.vertical && 'vertical'}
                />
        

        </div>
    );
}