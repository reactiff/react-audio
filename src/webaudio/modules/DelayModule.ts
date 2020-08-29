import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';


class DelayModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            init: (options?: any) => {
                return new Promise(resolve => {
                    proxy.ownEndpoints.default = proxy.context.createDelay();
                    proxy.ownEndpoints.default.delayTime.value = params.delayTime || 0;
                    resolve();
                });
            }
        });

        this.$type = 'Delay';
        
        proxy = this;

    }
}

export default DelayModule;