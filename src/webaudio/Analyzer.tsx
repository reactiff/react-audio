import React, { useRef, useEffect, useState } from 'react';
import paramsFromProps from './paramsFromProps'
import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

import AnalyzerModule from './modules/AnalyzerModule';
import './css/analyzer.css'

type AnalyzerType = {
    //standard props
    children?: any,
    //specific
    type?: any
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
    aspect?: null
    onClick?: (analyzer: any) => void
}

const paramDefaults = {
    traces: false,
    rotate90: false,
    aspect: 1 / 16 * 9,
    type: 'wave',
}

export default (props: AnalyzerType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
    const proxy = useRef<any>();
    const canvasRef = useRef();
    const containerRef: any = React.createRef();
    const [canvasProps, setCanvasProps] = useState<any>();

    const pp = paramsFromProps(props, {}, paramDefaults);

    useEffect(() => {

        if (containerRef.current && !canvasProps) {
            const rect = containerRef.current.getBoundingClientRect();
            if (rect) {
                if (props.aspect) {
                    rect.height = rect.width * props.aspect;
                    containerRef.current.style.height = rect.height + 'px';
                }
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
                target,
                context,
                paramsFromProps(props, {canvasRef, ...canvasProps}, paramDefaults),
            )
            target.registerListener(proxy.current);
        }

    }, [containerRef.current, canvasRef.current, proxy.current, canvasProps]);

    return (
        <parentContext.Provider value={proxy.current}>
            <div ref={containerRef} className="analyzer">
                <canvas ref={canvasRef} className="analyzer-canvas fill" {...canvasProps} />
            </div>
        </parentContext.Provider>
    );
}