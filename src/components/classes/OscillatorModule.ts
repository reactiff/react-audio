import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class OscillatorModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoint = proxy.context!.createOscillator();
                proxy.audioEndpoint.type = params.type;
                
            },

            start: (time: number) => {
              
                console.log(' (start) @' + time + ' : ' + proxy.getDescription());

                if(params.frequency!==undefined){
                    proxy.audioEndpoint.frequency.setValueAtTime(params.frequency, time)
                }

                proxy.audioEndpoint.start(time);
                
                if(params.duration!==undefined){
                    proxy.audioEndpoint.stop(time + params.duration);
                }
                
                
            }

        });

        this.$type = 'Oscillator';
        
        proxy = this;

    }
}

export default OscillatorModule;