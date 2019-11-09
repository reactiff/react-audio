import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';


class DelayModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            init: () => {
                proxy.audioEndpoint = proxy.context.createDelay();
                proxy.audioEndpoint.delayTime.value = params.delayTime || 0;
            }
        });

        this.$type = 'Delay';
        
        proxy = this;

    }
}

export default DelayModule;