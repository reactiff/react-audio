import React, {useState, useEffect, useRef} from 'react';
import Log from '../modules/Log';
import '../css/audiocontext.css';
import * as keyMap from './keyMap';

import audioContext from '../Context/audioContext';
import parentContext from '../Context/parentContext';
import BaseAudioGraphNodeModule from '../modules/BaseAudioGraphNodeModule';

declare var AudioContext: any | null, webkitAudioContext: any; 
function getAudioContext() {
    if ('webkitAudioContext' in window) return new webkitAudioContext();
    if ('AudioContext' in window) return new AudioContext();
    return { destination: {} }; // mock for testing
}

export default (props: any) => {

    Log.write('AudioGraph');

    const [context] = useState(getAudioContext());

    const bindings = useRef<{[index:string]: any}>({ }).current;
    const listeners = useRef<string[]>([]).current;

    const [instrument, setInstrument] = React.useState({});

    useEffect(() => {
        const onKeyDown = (event: any) => keyMap.onKeyDown(event, bindings);
        const onKeyUp = (event: any) => keyMap.onKeyUp(event, bindings);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        return () => {
            document.removeEventListener('keydown', onKeyDown, false);
            document.removeEventListener('keyup', onKeyUp, false);
        };
    }, [])

    const mockContext = {
        getDescription() {
            return 'AudioGraph';
        }
    };
    
    const target = React.useRef({

        $type: 'AudioGraph',

        selectedInstrument: instrument,

        async init(options: any) {
            await Promise.all(listeners.map((listener: any) => listener.init(options)));
        },

        receive: (source: any) => {
            return new Promise(async (resolve) => {
                const incoming = source.getEndPoints();
                let index=0;
                for(let endPoint of incoming){
                    endPoint.connect(context.destination);
                    Log.connection(source, index++, 'MASTER');
                }
                listeners.forEach((l: any) => l.receive(source));
                resolve();
            });
        },

        passThrough(source: BaseAudioGraphNodeModule) {
            Log.passThrough(mockContext, source);
            const inputs = source.getEndPoints();
            let index=0;
            for(let endPoint of inputs){
                endPoint.connect(context.destination);
                Log.connection(source, index++, 'MASTER');
            }
            listeners.forEach((l: any) => l.receive(source));
        },
    
        async registerListener(aux: any) {
            listeners.push(aux);
        },

        async registerSource(source: any) {
            Log.registerSource(mockContext, source);
            if(source.binding){
                await target.registerBinding(source);
            }
        },
        
        async registerBinding(source: any) {
            const key = source.$params.binding;
            bindings[key] = source;
        },

        async bindChromaticInstrument(source: any) {
            bindings['chromatic'] = source;
            bindings['octave'] = source.$params.octave;
            bindings['sustained'] = {};
            setInstrument(source);
        },

        findParent(match: {(x: any) : boolean}, iteration: number = 0) : any {
            if (match(this)) {
                return this;
            }
            return null;
        }
    }).current;
        
    return (
        <audioContext.Provider value={context}>
            <parentContext.Provider value={target}>
                <div className="audio-graph">
                    {props.children}    
                </div>
            </parentContext.Provider>
        </audioContext.Provider>
    )
}

