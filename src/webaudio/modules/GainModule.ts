import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import { applyTransition } from './TransitionMethod';

class GainModule extends BaseAudioGraphNodeModule {

    isInput: boolean;

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: (options?: any) => {
                return new Promise((resolve) => {
                    proxy.ownEndpoints.default = proxy.context.createGain();
                    //const value = typeof params.value !== 'undefined' ? params.value : 1;
                    const value = this.evalParam(params.value, options, 1);
                    proxy.ownEndpoints.default.gain.value = value ;    
                    resolve();
                });
            },
 
            start: (time: number, options?: any) => {
                if (typeof params.targetValue !== 'undefined') {
                    applyTransition({
                        audioParam: proxy.ownEndpoints.default.gain, 
                        time,
                        method: params.method, 
                        targetValue: this.evalParam(params.targetValue, options, 1),
                        delay: this.evalParam(params.delay, options, 1),
                        duration: this.evalParam(params.duration, options, 1),
                    });
                }
            }

        });

        
        this.$type = 'Gain';
        this.isInput = true;
        
        proxy = this;

    }

    getShortDescription() {
        const name = this.$params.tag || this.$type;
        const tokens = [];
        if (this.$params.value) tokens.push(this.$params.value);
        if (this.$params.targetValue) tokens.push('to:' + this.$params.targetValue);
        return name + `(${tokens.join(',')})`;
    }
}

export default GainModule;