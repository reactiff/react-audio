import React from 'react';
import TransportModule from './modules/TransportModule';
import paramsFromProps from './paramsFromProps'
import './css/transport.css'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type TransportPropsType = {
    children?: any,
}

export default (props: TransportPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    let sessionInstruments = {};
    
    const startButtonRef: any = React.createRef();
    const stopButtonRef: any = React.createRef();

    const [proxy] = React.useState(new TransportModule(
        target,
        context,
        paramsFromProps(props, {startButtonRef: startButtonRef, stopButtonRef: stopButtonRef} )
    ));

    target.registerSource(proxy);

    let timer:any = null;
    const loop = (e: any) => {

        const beatsPerMeasure = 4;
        const bpm = 117;
        const beatDuration = 60000 / bpm;
        const barDuration = beatDuration * beatsPerMeasure;

        const beatsPerLoop = 16
        const loopDuration = beatDuration * beatsPerLoop

        const duration = {
            beat: beatDuration,
            bar: barDuration,
            '1n': barDuration,
            '2n': barDuration / 2,
            '4n': barDuration / 4,
            '8n': barDuration / 8,
            '16n': barDuration / 16,
            '32n': barDuration / 32,
            '64n': barDuration / 64
        }
        

        let loopInterval = duration['16n']
        const playSample = () => {
            for(let key of Object.keys(proxy.instruments)) {
                proxy.instruments[key].trigger();
            }
        }

        timer = setInterval(playSample, loopDuration);
        
        playSample();

    }


    const start = (e: any)=> {

        //trigger an instrument
        proxy!.context.resume();

        const beatsPerBar = 4;
        const bpm = 117;
        const beatDuration = 60000 / bpm;
        const barDuration = beatDuration * beatsPerBar;

        const duration = {
            beat: beatDuration,
            bar: barDuration,
            '1n': barDuration,
            '2n': barDuration / 2,
            '4n': barDuration / 4,
            '8n': barDuration / 8,
            '16n': barDuration / 16,
            '32n': barDuration / 32,
            '64n': barDuration / 64
        }
        
        const tracks = [
            { instrument: 'Kick', pattern: { signature:  '1010000000100000100100000010000010100000001000001010001000100000', note: 16 } },
            { instrument: 'Snare', pattern: { signature: '0000001000001000000000100000100000000010000010000000100101001000', note: 16 } },
            { instrument: 'HiHat', pattern: { signature: '1010101010101010111010101010101010101010101010101010101010101010', note: 16 } },
            // { instrument: 'Clap', pattern: { signature: '0101', note: 8 } }
        ];

        let beatNumber = 0;//;-beatsPerBar;
        
        let transportNote = 16; 
        let transportInterval = duration['16n']

        const processBeat = () => {

            if(beatNumber>=0){

                for(let track of tracks) {

                    const divisor = transportNote / track.pattern.note;

                    if(beatNumber % divisor === 0){

                        const mappedIndex = beatNumber / divisor;

                        const size = track.pattern.signature.length;
                        const patIndex = mappedIndex % size;

                        let signal;
                        if(patIndex < track.pattern.signature.length){
                            signal = track.pattern.signature[patIndex];
                        }
                        
                        if(signal==='1'){
                            proxy.instruments[track.instrument].trigger();
                        }

                    }

                    
                }
            }
            beatNumber++;
        }

        timer = setInterval(processBeat, transportInterval);
        
        processBeat();

    };

    const stop = (e: any) => {
        for(let key of Object.keys(proxy.instruments)) {
            proxy.instruments[key].stop();
        }
        if(timer){
            clearInterval(timer);
        }
    };
    
    return (
        <parentContext.Provider value={proxy}>
            <div className="transport">
                <div className="buttons">
                    <div className="button play" onMouseDown={loop}></div>
                    <div className="button stop" onMouseDown={stop}></div>    
                </div>
                {props.children}
            </div>    
        </parentContext.Provider>
    );
}