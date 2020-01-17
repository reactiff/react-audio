import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class GainModule extends BaseAudioGraphNodeModule {

    isInput: boolean;

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoints.default = proxy.context.createGain();
                proxy.audioEndpoints.default.gain.value = params.value || params.startValue || 1;
                
            },

            start: (time: number) => {
              
                if(!proxy.sources.length){
                    return;
                }

                const value = params.value || params.startValue || 1;
                const attenuatedStart = value;
                
                proxy.audioEndpoints.default.gain.setValueAtTime(attenuatedStart, time);

                const targetValue = params.targetValue || params.endValue;
                if(targetValue){

                    const attenuatedEnd = targetValue;
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