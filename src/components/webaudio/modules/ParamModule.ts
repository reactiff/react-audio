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

                const targetParams = proxy.target.getAudioParam(params.name);
                
                // connect each incoming input end point to the parent target's named a-rate parameters 
                const endPoints = Object.keys(proxy.audioEndpoints).map(key => proxy.audioEndpoints[key]);

                for(let ep of endPoints){
                    for(let p of targetParams){
                        ep.connect(p);    
                    }
                }

            },

            start: (time:number) => {

                const targetParams = proxy.target.getAudioParam(params.name);

                if(params.value){

                    //set initial values
                    for(let p of targetParams){
                        p.setValueAtTime(params.value, time + (params.delay || 0));
                    }
                    
                    if(params.targetValue && params.duration){

                        const method = params.method || TransitionMethod.Linear;

                        switch(method){

                            case TransitionMethod.Target:

                                for(let p of targetParams){
                                    p.setTargetAtTime(
                                        params.targetValue, 
                                        time + (params.delay || 0),
                                        (params.duration || 0)
                                    );
                                }
                                
                                break;

                            case TransitionMethod.Exponential:

                                for(let p of targetParams){
                                    p.exponentialRampToValueAtTime(
                                        params.targetValue, 
                                        time + (params.delay || 0) + (params.duration || 0)    
                                    );
                                }

                                break;

                            default: //TransitionMethod.Linear

                                for(let p of targetParams){
                                    p.linearRampToValueAtTime(
                                        params.targetValue, 
                                        time + (params.delay || 0) + (params.duration || 0)    
                                    );
                                }

                                break;

                        }

                    }
                    
                    
                }
                else if(params.curve) {

                    for(let p of targetParams){
                        p.setValueCurveAtTime(
                            params.curve, 
                            time + (params.delay || 0), 
                            (params.duration || 0)
                        );
                    }
                    
                }
                
                

            }
            
           
        });

        this.$type = 'Param';
        
        proxy = this;

    }
}

export default ParamModule;