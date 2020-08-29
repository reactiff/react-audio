import React, { useState, useEffect, useRef, useMemo } from 'react';
import './css/instrument.css';
import InstrumentModule from './modules/InstrumentModule';
import paramsFromProps from './paramsFromProps'

import ui from '../mpg/Mpg';

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

export default (props: any) => {
    
    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);
    const graph = target.findParent((node: any) => node.$type === 'AudioGraph');

    const [proxy] = React.useState(new InstrumentModule(
        target,
        context,
        paramsFromProps(
            props, 
            {}, 
            {
                duration: 0.1,
                octave: 4,
            }
        )
        
    ));

    const [status, setStatus] = React.useState('');

    useEffect(()=>{
        
        //register as Instrument with Transport

        // DO WE NEED THIS?
        // if(target.findParent){
        //     const transport = target.findParent('Transport');
        //     if (transport) {
        //         transport.registerInstrument(proxy);
        //     }
        // }

        // WHY IS THIS ON PROPS?
        // if(props.registerInstrument) {
        //     props.registerInstrument(proxy);
        // }

        //register as Source
        target.registerSource(proxy);

        proxy.registerAsInstrument();


    },[]);
        
    const start = (e: any) => {
        if (context.state !== 'running') {
            context.resume();
        }
        if (status !== 'suspended') {
            proxy.trigger({hold: true, adsr: {s: 1} });
        }
        setStatus('playing');
    }
    const stop = (e: any) => {
        // proxy.stop();
        context.suspend();
        setStatus('suspended');
    }

    // const selected = graph.selectedInstrument.id === proxy.id;
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="instrument">

                {/* {
                    !selected &&
                    <ui.Button onClick={() => proxy.registerAsInstrument()} text="Select" />
                } */}
                
                <div className="grow">
                    {proxy.name}
                </div>

                
                <div className="rack group">
                    {props.children}
                </div>
                
                
                <div key="-1" className="trigger">
                    <div className="buttons">
                        {
                            status !== 'playing' && 
                            <div className="button play" onMouseDown={start}></div>
                        }
                        {
                            status === 'playing' && 
                            <div className="button stop" onMouseDown={stop}></div>
                        }
                    </div>
                </div>
            </div>
        </parentContext.Provider>
    );
    
        
    
}