import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

export enum TransitionMethod {
    Linear,
    Exponential,
    Target
}

class ParamModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            connect: () => {

                const p = proxy.target.getAudioParam(params.for);
                
                if(!p){
                    throw new Error(proxy.getDescription() + ' does not have a property named ' + params.for);
                }

                // connect each incoming input end point to the parent target's named a-rate parameters 

                const endPoints = proxy.inputEndpoints;

                for(let ep of endPoints){
                    ep.connect(p);
                }

            },

            start: (time:number) => {

                const p = proxy.target.getAudioParam(params.for);
                
                if(!p){
                    throw new Error(proxy.getDescription() + ' does not have a property named ' + params.for);
                }

                if(params.value){

                    if(params.duration){

                        const method = params.method || TransitionMethod.Linear;

                        switch(method){

                            case TransitionMethod.Target:
                                p.setTargetAtTime(
                                    params.value, 
                                    time + (params.delay || 0),
                                    (params.duration || 0)
                                );
                                break;

                            case TransitionMethod.Exponential:
                                p.exponentialRampToValueAtTime(
                                    params.value, 
                                    time + (params.duration || 0)    
                                );
                                break;

                            default: //TransitionMethod.Linear
                                p.linearRampToValueAtTime(
                                    params.value, 
                                    time + (params.duration || 0)    
                                );
                                break;

                        }

                    }
                    else{
                        p.setValueAtTime(params.value, time + (params.delay || 0));
                    }

                    
                }
                else if(params.curve) {
                    p.setValueCurveAtTime(
                        params.curve, 
                        time + (params.delay || 0), 
                        (params.duration || 0)
                    );
                }
                
                

            }
            
           
        });

        this.$type = 'Param';
        
        proxy = this;

    }
}

export default ParamModule;