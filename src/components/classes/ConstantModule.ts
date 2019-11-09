import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class ConstantModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoint = new ConstantSourceNode(proxy.context, {
                    offset: params.value
                }); 
                
            },

            start: (time: number) => {
              
                proxy.audioEndpoint.start(time, 0, params.duration);
                
            }
           
        });

        this.$type = 'Constant';
        
        proxy = this;

    }
}

export default ConstantModule;