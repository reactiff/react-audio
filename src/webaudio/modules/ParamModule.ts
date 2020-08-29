import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import Log from './Log';
import TransitionMethod, {applyTransition} from './TransitionMethod';

class ParamModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            connect: () => {

                return new Promise(async (resolve)=>{

                    const targetParams = proxy.target.getAudioParam(params.name);
                    
                    // connect each received endpoint to the parent target's named a-rate parameters 
                    // FOUND THE PROBLEM WITH PARAM AUTOMATION

                    // You should connect receivedEndpoints to targetParams!

                    const keys = Object.keys(proxy.receivedEndpoints);

                    for(let key of keys){
                        for(let p of targetParams){
                            const received = proxy.receivedEndpoints[key];
                            received.connect(p);    
                        }
                    }

                    resolve();
                });

            },

            start: (time:number, options: any) => {

                //if (proxy.tag === 'LFOFrequency') debugger;

                let durationValue;
                
                const targetParams = proxy.target.getAudioParam(params.name);

                //set initial values
                if(typeof params.value !== 'undefined'){
                    for(let p of targetParams) {
                        if (params.delay) {
                            p.setValueAtTime(params.value, time + (params.delay || 0));
                        }
                        else {
                            p.value = params.value;
                        }
                    }
                    proxy.target.initializedParams[params.name] = true;
                }
            
                if(params.targetValue){

                    durationValue = params.duration;
                    if(typeof params.duration === 'undefined'){
                        //if no duration specified, use target's duration
                        const paramsDefinedInTarget = proxy.target.getAudioParam('duration');
                        if (!paramsDefinedInTarget.length) throw new Error('Param is missing duration');
                        durationValue = paramsDefinedInTarget[0].value;
                    }

                    targetParams.forEach((p: AudioParam) => {
                        applyTransition({
                            time,
                            method: params.method, 
                            audioParam: p, 
                            targetValue: params.targetValue,
                            delay: params.delay,
                            duration: params.duration,
                        });
                    });
                    
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