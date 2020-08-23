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

                let durationValue;
                
                const targetParams = proxy.target.getAudioParam(params.name);

                if(params.value){
                    //set initial values
                    if(typeof params.value !== 'undefined'){
                        for(let p of targetParams){
                            p.setValueAtTime(params.value, time + (params.delay || 0));
                        }
                    }
                }
                
                if(params.targetValue){

                    durationValue = params.duration;
                    if(typeof params.duration === 'undefined'){
                        //if no duration specified, use target's duration
                        const paramsDefinedInTarget = proxy.target.getAudioParam('duration');
                        if (!paramsDefinedInTarget.length) throw new Error('Param is missing duration');
                        durationValue = paramsDefinedInTarget[0].value;
                    }

                    const method = params.method || TransitionMethod.Linear;

                    switch(method){

                        case TransitionMethod.Target:

                            for(let p of targetParams){
                                p.setTargetAtTime(
                                    params.targetValue, 
                                    time + (params.delay || 0),
                                    (durationValue || 0)
                                );
                            }
                            
                            break;

                        case TransitionMethod.Exponential:

                            for(let p of targetParams){
                                p.exponentialRampToValueAtTime(
                                    params.targetValue, 
                                    time + (params.delay || 0) + (durationValue || 0)    
                                );
                            }

                            break;

                        default: //TransitionMethod.Linear

                            for(let p of targetParams){
                                p.linearRampToValueAtTime(
                                    params.targetValue, 
                                    time + (params.delay || 0) + (durationValue || 0)    
                                );
                            }

                            break;

                    }

                }
                else if(params.curve) {

                    for(let p of targetParams){
                        p.setValueCurveAtTime(
                            params.curve, 
                            time + (params.delay || 0), 
                            (durationValue || 0)
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