import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class AudioSourceModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;
        

        super(target, audioContext, params, {

            bufferCallbacks: [],

            setBuffer: (callback:any) =>{
                if(proxy.buffer){
                    callback(proxy.buffer);
                }
                else{
                    proxy.operations.bufferCallbacks.push(callback);
                }
            },

            loadBuffer: () => {

                var request = new XMLHttpRequest();
        
                request.open("GET", params.src, true);
                request.responseType = "arraybuffer";
      
                request.onload = function() {
                    
                  var audioData = request.response;
      
                  proxy.context.decodeAudioData(audioData, (buffer: any) => {
      
                      proxy.buffer = buffer;

                      if(proxy.operations.bufferCallbacks.length){
                          const callbacks = proxy.operations.bufferCallbacks.slice(0);
                          for(let cb of callbacks){
                              cb(buffer);
                          }
                          proxy.operations.bufferCallbacks = [];
                      }
                      
                    },
                    function(e: any) {
                        console.error(e);
                        throw new Error(e.message)
                    }
                  );
                };

                request.send();
            },

            init: (options?: any | null) => {
                return new Promise(resolve => {
                  proxy.ownEndpoints['default'] = proxy.context.createBufferSource();
                  proxy.operations.setBuffer((buffer:any)=>{
                    proxy.ownEndpoints.default.buffer = buffer;
                    resolve();
                  })
                });
            },

            start: async (time: number) => {
                proxy.ownEndpoints.default.start(time) 
            },

            stop: () => {
                if(proxy.audioEndpoint){
                    proxy.ownEndpoints.default.stop();
                }
            }

        });

        this.$type = 'AudioSource';

        this.operations.loadBuffer();

        proxy = this;

    }
}

export default AudioSourceModule;