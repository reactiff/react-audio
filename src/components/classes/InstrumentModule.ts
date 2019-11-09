import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class InstrumentModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
            
        let proxy: any = null;

        super(target, audioContext, params, {});

        this.$type = 'Instrument';

        proxy = this;
        
    }
}

export default InstrumentModule;