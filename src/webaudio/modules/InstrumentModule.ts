import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import mergeProps from './mergeProps';

class InstrumentModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
            
        let proxy: any = null;

        super(target, audioContext, params, {

            //Instrument
            trigger: async (options?: any | null) => {

                const adsr = mergeProps({...proxy.adsr}, proxy.$params.adsr);
                const moduleOptions = mergeProps({adsr}, proxy.$params);
                const triggerOptions = mergeProps(moduleOptions, options);

                //init all
                await proxy.init(triggerOptions);

                await proxy.connect();

                if (proxy.context.state !== 'running') {

                    proxy.context.resume();    
                }

                return proxy.start(proxy.context.currentTime, triggerOptions);
        
            }, 

            release: async (options?: any | null) => {

                const adsr = mergeProps({...proxy.adsr}, proxy.$params.adsr);
                const moduleOptions = mergeProps({adsr}, proxy.$params);
                const releaseOptions = mergeProps(moduleOptions, options);

                releaseOptions.time = proxy.context.currentTime;
                
                return proxy.stop(releaseOptions);
        
            }, 
            
            getEndPoints() {
                return Object.values(proxy.receivedEndpoints);
            },

        });

        this.$type = 'Instrument';

        proxy = this;
        
    }

}

export default InstrumentModule;