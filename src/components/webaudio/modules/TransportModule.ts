import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import InstrumentModule from './InstrumentModule'

class TransportModule extends BaseAudioGraphNodeModule {

    instruments: any;

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                let playing = false;

                params.startButtonRef.current.addEventListener("click", function(e:any) {
                    if (!playing) {
                        playing = true;
                    } 
                });

                params.stopButtonRef.current.addEventListener("click", function(e:any) {
                    if (playing) {
                        playing = false;
                    } 
                });
            },

            connect: () => {}


        });

        this.instruments = {};
        this.$type = 'Transport';
        
        proxy = this;

    }

    //override receive
    receive(source: any) {
        const proxy =  this;
        return new Promise(async (resolve) => {
            proxy.passThrough(source);
            resolve();
        });
    }

    registerInstrument(instrument: InstrumentModule) {
        this.instruments[instrument.$params.name] = instrument;
    }

}

export default TransportModule;