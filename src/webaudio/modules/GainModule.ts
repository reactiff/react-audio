import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class GainModule extends BaseAudioGraphNodeModule {

    isInput: boolean;

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: async () => {
                return new Promise(resolve => {
                    proxy.audioEndpoints.default = proxy.context.createGain();
                    //proxy.audioEndpoints.default.gain.value = params.value || params.startValue || 1;
                    resolve();
                });
            },
 
            start: (time: number) => {
              
                // WE REALLY NEED THIS TO AUTOMATE PARAMETERS ON GAIN

                if(!proxy.sources.length){
                    return;
                }

                const value = { 
                    initial: undefined,
                    target: undefined,
                };
                
                if (typeof params.value !== 'undefined') {
                    value.initial = params.value;
                } 
                else if (typeof params.startValue !== 'undefined') {
                    value.initial = params.startValue;
                } 
                if (typeof value.initial !== 'undefined') {
                    proxy.audioEndpoints.default.gain.setValueAtTime(value.initial, time);
                }
                
                if (typeof params.targetValue !== 'undefined') {
                    value.target = params.targetValue;
                }
                else if (typeof params.endValue !== 'undefined') {
                    value.target = params.endValue;
                }

                if (typeof value.target !== 'undefined') {

                    const attenuatedEnd = value.target;
                    const delay = proxy.$params.delay || 0;
                    const duration = proxy.$params.duration || 0;

                    proxy.audioEndpoints.default.gain.exponentialRampToValueAtTime(attenuatedEnd, 
                        time + delay + duration);

                }
                
            }

        });

        this.$type = 'Gain';
        this.isInput = true;
        
        proxy = this;

    }
}

export default GainModule;