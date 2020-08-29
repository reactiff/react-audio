import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class PositionModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                return new Promise(resolve => {
                
                    proxy.ownEndpoints.default = proxy.context.createPanner();

                    //set params
                    for(let key in params){
                        if(params.hasOwnProperty(key)){
                            proxy.ownEndpoints.default[key] = params[key];
                        }
                    }

                    resolve();
                });
            }

        });

        this.$type = 'Pan';
        
        proxy = this;

    }
}

export default PositionModule;