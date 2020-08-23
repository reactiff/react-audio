import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class ConstantModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: async () => {

                return new Promise(resolve => {
                    proxy.audioEndpoints.default = new ConstantSourceNode(proxy.context, {
                        offset: params.value
                    }); 
                    resolve();
                });
                
            },

            start: (time: number) => {
              
                proxy.audioEndpoints.default.start(time, 0, params.duration);
                
            }
           
        });

        this.$type = 'Constant';
        
        proxy = this;

    }

    getDescription() {
        return ' CONST ('+ this.$params.value +')';
    }
}

export default ConstantModule;