import React, { ReactElement } from 'react';

import AnalyzerModule from './classes/AnalyzerModule';

import paramsFromProps from './paramsFromProps'
  
import './css/analyzer.css'

type AnalyzerType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //specific
    type: any

    width?: number
    height?: number

    dcOffset?: number
    scale?: number

    rotate90?: boolean
    sizeX?: number
    sizeY?: number
    traces?: boolean
    color?: string

    onClick?: (analyzer: any) => void
}

const paramDefaults = {
    width: 200,
    height: 100,
    traces: "f",
    rotate90: false,
    color: "white"
}

export default (props: AnalyzerType) => {

    let canvas: ReactElement | null = null;
    let proxy: AnalyzerModule | null = null;

    if(props.context){
            
        const canvasRef: any = React.createRef();

        const params = paramsFromProps(props, {canvasRef: canvasRef}, paramDefaults);

        const style={
            width: params.width / 2,
            height: params.height / 2
        };

        canvas = (<canvas ref={canvasRef} className="analyzer" width={props.width} height={props.height} style={style}></canvas>)
        
        proxy = new AnalyzerModule(
            props.target,
            props.context,
            params
        );

        props.target.registerListener(proxy);

    }
    
    return (
        <div className="analyzer">
            
            {canvas}

        </div>
    );
}