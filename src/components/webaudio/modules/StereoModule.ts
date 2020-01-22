import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class StereoModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                if (proxy.context.createStereoPanner) {
                    proxy.audioEndpoints.default = proxy.context.createStereoPanner();

                    //set params
                    for(let key in params){
                        if(params.hasOwnProperty(key)){
                            try{
                                proxy.audioEndpoints.default[key].value = params[key];
                            }
                            catch(ex){ 
                                try{
                                    proxy.audioEndpoints.default[key] = params[key];
                                }
                                catch(ex){
                                    throw new Error('Invalid param ' + key);
                                }
                            }
                            
                        }
                    }
                    
                } else {

                    //WEBKIT IMPLEMENTATION
                    var panner = proxy.context.createPanner();
                    panner.panningModel = 'equalpower';
                    const value = params.pan;
                    panner.setPosition(value, 0, 1 - Math.abs(value));
                    proxy.audioEndpoints.default = panner;
                }

                

                
                
            }

        });

        this.$type = 'Stereo';
        
        proxy = this;

    }
}

export default StereoModule;