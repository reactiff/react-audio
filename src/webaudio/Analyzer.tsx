import React, { ReactElement, useRef, useEffect, useState } from 'react';

import AnalyzerModule from './modules/AnalyzerModule';

import paramsFromProps from './paramsFromProps'
  
import './css/analyzer.css'

type AnalyzerType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //specific
    type: any

    x?: string,
    y?: string,

    margin?: number
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
    traces: false,
    rotate90: false,
    color: "white"
}

export default (props: AnalyzerType) => {

    const proxy = useRef<any>();
    const canvasRef = useRef();

    const containerRef: any = React.createRef();
    
    const [canvasProps, setCanvasProps] = useState<any>();
    
    useEffect(() => {

        if (containerRef.current && !canvasProps) {
            const rect = containerRef.current.getBoundingClientRect();
            if (rect) {
                const temp = { 
                    style: {
                        width: rect.width,
                        height: rect.height,
                    },
                    width: rect.width,
                    height: rect.height,
                };
                setCanvasProps(temp);
            }
            
        }

        if (canvasRef.current && !proxy.current && canvasProps) {
            proxy.current = new AnalyzerModule(
                props.target,
                props.context,
                paramsFromProps(props, {canvasRef, ...canvasProps}, paramDefaults),
            )
            props.target.registerListener(proxy.current);
        }

    }, [containerRef.current, canvasRef.current, proxy.current, canvasProps]);

    return (
        <div ref={containerRef} className="analyzer-container">
            {
                <canvas ref={canvasRef} className="analyzer-canvas" {...canvasProps} />
            }
        </div>
    );
}