import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class GainModule extends BaseAudioGraphNodeModule {

    

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoint = proxy.context.createGain();
                proxy.audioEndpoint.gain.value = params.value || params.startValue || 1;
                
            },

            start: (time: number) => {
              
                if(!proxy.sources.length){
                    return;
                }

                console.log(' (start) @' + time + ' : ' + proxy.getDescription());

                //const count = proxy.sources.length || 1;

                const value = params.value || params.startValue || 1;

                // const attenuatedStart = count > 1 ? 
                //     value / count : 
                //     value;
                const attenuatedStart = value;
                
                proxy.audioEndpoint.gain.setValueAtTime(attenuatedStart, 
                    time);


                const targetValue = params.targetValue || params.endValue;
                if(targetValue){

                    // const attenuatedEnd = count > 1 ? 
                    //     targetValue / count : 
                    //     targetValue;

                    const attenuatedEnd = targetValue;

                    const duration = proxy.$params.duration || 0;

                    proxy.audioEndpoint.gain.exponentialRampToValueAtTime(attenuatedEnd, 
                        time + duration);

                }
                
            }

        });

        this.$type = 'Gain';
        
        proxy = this;

    }
}

export default GainModule;