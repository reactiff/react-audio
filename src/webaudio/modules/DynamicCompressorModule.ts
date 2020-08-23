import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class DynamicCompressorModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            init: async () => {

                return new Promise(resolve => {
                    if(!params.enabled){
                        resolve();
                        return;
                    }
                    
                    const time = proxy.context.currentTime;

                    // Create a compressor node
                    const compressor = proxy.audioEndpoints.default = proxy.context.createDynamicsCompressor();
                    compressor.threshold.setValueAtTime(-50, time);
                    compressor.knee.setValueAtTime(40, time);
                    compressor.ratio.setValueAtTime(12, time);
                    compressor.attack.setValueAtTime(0, time);
                    compressor.release.setValueAtTime(0.25, time);
                    resolve();
                });
            }
        });

        this.$type = 'DynamicCompressor';
        
        proxy = this;

    }
}

export default DynamicCompressorModule;