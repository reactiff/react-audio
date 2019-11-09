import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class ConstantSourceModule extends BaseAudioGraphNodeModule {

    

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoint = proxy.context.createGain();

                console.log(proxy.getDescription() + ' initialized');
                
            },

            start: (time: number) => {
              
                if(!proxy.sources.length){
                    return;
                }

                console.log(' start @' + time + ' : ' + proxy.getDescription());

                const count = proxy.sources.length || 1;

                const attenuatedStart = count > 1 ? 
                    proxy.$params.startValue / count : 
                    proxy.$params.startValue;
                
                const attenuatedEnd = count > 1 ? 
                    proxy.$params.endValue / count : 
                    proxy.$params.endValue;

                proxy.audioEndpoint.gain.setValueAtTime(attenuatedStart, 
                    time);

                proxy.audioEndpoint.gain.exponentialRampToValueAtTime(attenuatedEnd, 
                    time + proxy.$params.duration);

              
            }

        });

        this.$type = 'ConstantSource';
        
        proxy = this;

    }
}

export default ConstantSourceModule;