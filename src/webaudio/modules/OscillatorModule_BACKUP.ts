import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import Log from './Log';
import uuid from 'uuid/v4';

const MAX_TOTAL_GAIN = 0.75

enum STATUS {
    CREATED,
    STARTED,
    STOPPING,
}

const shapes = ['sine', 'sawtooth', 'square', 'triangle'];

class OscillatorModule extends BaseAudioGraphNodeModule {

    oscillators: { [index: string]: any };
    sustained: { [index: string]: any };

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        const getFrequency = (options?: any) => {
            return params.frequency || (options && options.frequency);
        }

        super(target, audioContext, params, {

            init:  (options?: any) => {

                return new Promise(resolve => {

                    // TODO: we need to cleanup spent oscillators

                    const frequency = getFrequency(options);
                    const frequencyKey = !!frequency ? frequency : 'default';

                    const osc = {
                        // id: uuid(),
                        oscillator: proxy.context.createOscillator(),
                        status: STATUS.CREATED,
                        gain: proxy.context.createGain(),
                        adsr: options.adsr || proxy.adsr,
                    };
                    osc.oscillator.type = proxy.$params.type;
                    proxy.oscillators[frequencyKey] = osc;
                    
                    if(params.wave){
                        var wave = proxy.context.createPeriodicWave(params.wave[0], params.wave[1], {disableNormalization: true});
                        osc.oscillator.setPeriodicWave(wave);
                    }

                    osc.oscillator.connect(osc.gain);

                    // The endpoints are gain stages and are static
                    proxy.ownEndpoints[frequencyKey] = osc.gain;  
                    
                    resolve();
                });
                
            },

            start: (time: number, options?: any) => {

                if (proxy.tag ==='LFO') debugger;
                
                //parameteric frequency
                const frequency = getFrequency(options);
                const frequencyKey = !!frequency ? frequency : 'default';

                if (proxy.sustained[frequencyKey]) {
                    return;
                }

                const velocity = options && options.velocity || params.velocity || 1;
                const attackGain = velocity;

                let osc = proxy.oscillators[frequencyKey];

                if (!proxy.initializedParams['frequency']) {
                    const frequencyOrDefault = typeof frequency !== 'undefined' ? frequency : 440
                    osc.oscillator.frequency.value = frequencyOrDefault;
                }
                
                const adsr = osc.adsr;
                // attack
                if (adsr.a > 0) {
                    osc.gain.gain.value = 0; //setValueAtTime(attackGain, time);
                    // attack
                    osc.gain.gain.setTargetAtTime(attackGain, time, adsr.a);
                    // decay to sustain
                    osc.gain.gain.setTargetAtTime(attackGain * adsr.s, time + adsr.a, adsr.d);
            }
                else{
                    osc.gain.gain.value = attackGain * adsr.s;
                }

                                
                osc.oscillator.start(time + (proxy.delay || 0));

                if (options.autoRelease && typeof options.duration !== 'undefined') {
                    osc.oscillator.stop(time + options.duration)
                } 
                else {
                    // hold reference for those that don't auto-release
                    proxy.sustained[frequencyKey] =  osc;
                }
                
                delete proxy.oscillators[frequencyKey];

            },

            stop: (options?: any) => {

                const frequency = getFrequency(options);
                const frequencyKey = !!frequency ? frequency : 'default';

                let osc = proxy.sustained[frequencyKey];

                const time = options.time;
                osc.gain.gain.setTargetAtTime(0.001, options.time, osc.adsr.r);
                osc.oscillator.stop(time + osc.adsr.r + 1);

                delete proxy.sustained[frequencyKey];

            },

            getAudioParam: (parameter: string): any[] => {
                const freqs = Object.keys(proxy.oscillators);
                const params = freqs.map(f => proxy.oscillators[f].oscillator[parameter]);
                return params;
            },

        });
        
        this.$params.type = resolveOscillatorTypeSwitch(params);
        this.$type = 'Oscillator';
        this.oscillators = {};
        this.sustained = {};

        proxy = this;

    }

    getDescription() {
        return this.getShortDescription();
    }

    getShortDescription() {
        const name = this.$params.tag || this.$params.type;
        const tokens = [];
        if (this.$params.frequency) tokens.push(this.$params.frequency);
        return name + `(${tokens.join(',')})`;
    }
}

const resolveOscillatorTypeSwitch = (params: any) => {
    if (params.sawtooth) {
        return 'sawtooth';
    }
    else if (params.square) {
        return 'square';
    }
    else if (params.triangle) {
        return 'triangle';
    }
    else if (params.type) {
        return params.type;
    }
    else if (params.random) {
        const types = params.types || shapes;
        return types[Math.round(Math.random() * (types.length - 1))];
    }
    else {
        return 'sine';
    }
};


export default OscillatorModule;