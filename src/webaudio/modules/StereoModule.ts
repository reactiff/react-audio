import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class StereoModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {

                return new Promise(resolve => {
                    
                    if (proxy.context.createStereoPanner) {
                        proxy.ownEndpoints.default = proxy.context.createStereoPanner();

                        //set params
                        for(let key in params){
                            if(params.hasOwnProperty(key)){
                                try{
                                    proxy.ownEndpoints.default[key].value = params[key];
                                }
                                catch(ex){ 
                                    try{
                                        proxy.ownEndpoints.default[key] = params[key];
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
                        proxy.ownEndpoints.default = panner;
                    }
                    resolve();
                });
            }
        });

        this.$type = 'Stereo';
        
        proxy = this;

    }
}

export default StereoModule;