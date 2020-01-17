import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class NoiseModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        
        super(target, audioContext, params, {

            init: () => {
                
                const endPoint = proxy.audioEndpoints.default = proxy.context.createBufferSource();

                const skip = Date.now() % 97;

                for(let i=0; i<skip; i++){
                    Math.random();    
                }
                

                var bufferSize = proxy.context.sampleRate;
                var buffer = proxy.context.createBuffer(1, bufferSize, proxy.context.sampleRate); //numchannels, length, sampleRate
                var output = buffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }

                endPoint.buffer = buffer;
                endPoint.loop = true;

                //set params
                for(let key in params){
                    if(params.hasOwnProperty(key)){
                        try{
                            endPoint[key].value = params[key];
                        }
                        catch(ex){ 
                            try{
                                endPoint[key] = params[key];
                            }
                            catch(ex){
                                throw new Error('Invalid param ' + key);
                            }
                        }
                        
                    }
                }
                
            },

            start: (time: number) => {
              
                proxy.audioEndpoints.default.start(time);
                
                if(params.duration!==undefined){
                    proxy.audioEndpoints.default.stop(time + params.duration);
                }
                
            },

            stop: () => {
                if(proxy.audioEndpoints.default){
                    proxy.audioEndpoints.default.stop();
                }
                
            }

        });

        this.$type = 'Noise';
        
        proxy = this;

    }
}

export default NoiseModule;