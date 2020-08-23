import React, {useState, useEffect, useRef} from 'react';
import renderChildren from '../renderChildren';
import Log from '../modules/Log';
import '../css/audiocontext.css';
import * as keyMap from './keyMap';

declare var AudioContext: any | null, webkitAudioContext: any; 

function getAudioContext() {
    if ('webkitAudioContext' in window) return new webkitAudioContext();
    if ('AudioContext' in window) return new AudioContext();
    return { destination: {} }; // mock for testing
}

export default (props: any) => {

    const [context] = useState<AudioContext | undefined>(getAudioContext());
    const bindings = useRef<{[index:string]: any}>({}).current;

    useEffect(() => {
        
        //keyboard bindings
        const onKeyDown = (event: any) => keyMap.onKeyDown(event, bindings);
        const onKeyUp = (event: any) => keyMap.onKeyUp(event, bindings);

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        if (props.onLoad && context) {
            props.onLoad(context);
        }

        return () => {
            document.removeEventListener('keydown', onKeyDown, false);
            document.removeEventListener('keyup', onKeyUp, false);
        };

    }, [])

    const mockContext = {
        getDescription() {
            return 'AudioContext';
        }
    };
    
    const target = {

        receive: (source: any) => {
            Log.receive(mockContext, source);
            const incoming = source.getEndPoints();
            let index=0;
            for(let endPoint of incoming){
                endPoint.connect(context!.destination);
                Log.connection(source, index++, 'MASTER');
            }
        },

        passThrough(source: any) {
            Log.passThrough(mockContext, source);
            const inputs = source.getEndPoints();
            let index=0;
            for(let endPoint of inputs){
                endPoint.connect(context!.destination);
                Log.connection(source, index++, 'MASTER');
            }
        },
    
        async registerSource(source: any) {
            
            Log.registerSource(mockContext, source);

            if(source.binding){
                await target.registerBinding(source);
            }
        },

        //passed through from any target register_Source
        async registerBinding(source: any) {
            const key = source.binding;
            if(bindings[key]){
                throw new Error('Key ' + source.binding + ' is already bound');
            }
            bindings[key] = source;
        }

    }

    const children = context ? renderChildren(props.children, { context: context, target: target }) : null;
    
    
    return <div className="audio-context">
        {children}    
    </div>

}

