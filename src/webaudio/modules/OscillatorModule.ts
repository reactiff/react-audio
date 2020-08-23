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

    oscillators: { [index: string]: any[] };
    adsr: { a: number, d: number, s: number, r: number };

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init:  async (options?: any) => {

                return new Promise(resolve => {

                    // TODO: we need to cleanup spent oscillators

                    const frequency = options && options.frequency || params.frequency;
                    const frequencyKey = !!frequency ? Math.round(frequency * 100) : 'default';

                    // The endpoints are gain stages and are static
                    // if (!proxy.audioEndpoints[frequencyKey]) {
                    //     proxy.audioEndpoints[frequencyKey] = proxy.context.createGain();  
                    // }   

                    //proxy.attenuate([frequencyKey]);
                    if (!this.oscillators[frequencyKey]) {
                        this.oscillators[frequencyKey] = [];
                    }
                    const freqOscillators = this.oscillators[frequencyKey];

                    const osc = {
                        id: uuid(),
                        oscillator: proxy.context.createOscillator(),
                        status: STATUS.CREATED,
                        gain: proxy.context.createGain(),
                    };

                    freqOscillators.push(osc);
                    
                    if (params.sine) {
                        osc.oscillator.type = 'sine';
                    }
                    else if (params.sawtooth) {
                        osc.oscillator.type = 'sawtooth';
                    }
                    else if (params.square) {
                        osc.oscillator.type = 'square';
                    }
                    else if (params.triangle) {
                        osc.oscillator.type = 'triangle';
                    }
                    else if (params.type) {
                        osc.oscillator.type = params.type;
                    }
                    else if (params.random) {
                        const types = params.types || shapes;
                        osc.oscillator.type = types[Math.round(Math.random() * (types.length - 1))];
                    }
                    else if(params.wave){
                        var wave = proxy.context.createPeriodicWave(params.wave[0], params.wave[1], {disableNormalization: true});
                        osc.oscillator.setPeriodicWave(wave);
                    }
                    
                    const desc = !!frequency ? frequency + 'Hz' : 'default';
                    Log.indentWrite('new ~' + frequencyKey + 'Hz --- to --> gain', this.oscillators);

                    osc.oscillator.connect(osc.gain);

                    resolve();
                });
                
            },

            start: (time: number, options?: any) => {

                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                const frequencyKey = !!frequency ? Math.round(frequency * 100) : 'default';

                // if(proxy.polyphonic && proxy.oscillatorState[frequencyKey]){
                //     return;
                // }
                
                const velocity = options && options.velocity || params.velocity || 1;
                const attackGain = velocity;

                //proxy.attenuate([frequencyKey])
                //const osc = proxy.audioEndpoints.default;

                let oscillators = proxy.oscillators[frequencyKey];
                let osc: any = null;
                let j = oscillators.length;
                while (j--) {
                    if (oscillators[j].status === STATUS.CREATED) {
                        oscillators[j].status = STATUS.STARTED;
                        osc = oscillators[j];
                        break;
                    } 
                }

                if (!!frequency) {
                    osc.oscillator.frequency.setValueAtTime(frequency, time);
                    // set adsr
                    if (oscillators.length === 1) {
                        osc.gain.gain.value = 0; //setValueAtTime(attackGain, time);
                    }
                    
                    // attack
                    if (this.adsr.a > 0) {
                        osc.gain.gain.setTargetAtTime(attackGain, time, this.adsr.a);
                    }
                    else{
                        osc.gain.gain.value = attackGain;
                    }
                }
                else 
                {
                    osc.oscillator.frequency.setValueAtTime(0, time);
                }
                
                // decay to sustain
                if (this.adsr.d) {
                    osc.gain.gain.setTargetAtTime(attackGain * this.adsr.s, time + this.adsr.a, this.adsr.d);
                }
                else {
                    osc.gain.gain.setValueAtTime(attackGain * this.adsr.s, time + this.adsr.a, this.adsr.d);
                }
                

                osc.oscillator.onended = () => {
                    osc.oscillator.disconnect();
                    let oscillators = proxy.oscillators[frequencyKey];
                    let j = oscillators.length;
                    while (j--) {
                        if (oscillators[j] && oscillators[j].status === STATUS.STOPPING) {
                            delete oscillators[j];
                            break;
                        } 
                    }
                }

                osc.oscillator.start(time);

                if (typeof params.duration !== 'undefined') {
                    osc.oscillator.stop(time + params.duration)
                }
                
            },

            stop: (options?: any) => {
                const frequency = options && options.frequency || params.frequency
                const frequencyKey = !!frequency ? Math.round(frequency * 100) : 'default';

                let oscillators = proxy.oscillators[frequencyKey];
                let j = oscillators.length;
                while (j--) {
                    if (oscillators[j] && oscillators[j].status === STATUS.STARTED) {
                        oscillators[j].status = STATUS.STOPPING;
                        const t = audioContext.currentTime;
                        const r = this.adsr.r;
                        oscillators[j].gain.gain.setTargetAtTime(0.8, t, r);
                        oscillators[j].gain.gain.setTargetAtTime(0.5, t + r * 1, r);
                        oscillators[j].gain.gain.setTargetAtTime(0.3, t + r * 2, r);
                        oscillators[j].gain.gain.setTargetAtTime(0.1, t + r * 3, r);
                        oscillators[j].gain.gain.setTargetAtTime(0.000001, t + r * 4, r);
                        oscillators[j].oscillator.stop(t + r * 6);
                    } 
                }

            },

            getAudioParam: (parameter: string): any[] => {
                const freqs = Object.keys(proxy.oscillators);
                return freqs.reduce((acc, f) => { 
                    const parameters = proxy.oscillators[f].filter((osc:any) => !!osc).map((osc:any) => osc.oscillator[parameter]);
                    return acc.concat(parameters);
                }, []);
            },

            getEndPoints() {
                const freqs = Object.keys(proxy.oscillators);
                return freqs.reduce((acc, f) => { 
                    const gains = proxy.oscillators[f].filter((osc:any) => !!osc).map((osc:any) => osc.gain);
                    return acc.concat(gains);
                }, []);
            },

        });
        
        this.$type = 'Oscillator';
        this.staticEndpoints = true;      
        this.oscillators = {};
        this.adsr = { a: 0, d: 0, s: 1, r: 0.2 };

        proxy = this;

    }

    getDescription() {
        return this.$params.purpose + '('+ this.$params.type +')';
    }
}

export default OscillatorModule;