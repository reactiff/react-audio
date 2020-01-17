import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';


const MAX_TOTAL_GAIN = 0.75

class OscillatorModule extends BaseAudioGraphNodeModule {

    oscillators: any;
    oscillatorState: any;
    gainStage: any;
    
    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: (options?: any) => {
                
                //worker function
                const initFreq = (frequency:number) => {
                    const frequencyKey = Math.round(frequency*100)
                    //see if there is an oscillator with this frequency already
                    if(proxy.oscillators[frequencyKey]){
                        //see if its on, and stop it...
                        if(proxy.oscillatorState[frequencyKey]){
                            proxy.oscillators[frequencyKey].stop();
                            proxy.oscillatorState[frequencyKey] = 0;
                        }
                    }
                    //create new oscillator
                    const osc = proxy.oscillators[frequencyKey] = proxy.context.createOscillator();
                    if(params.wave){
                        var wave = proxy.context.createPeriodicWave(params.wave[0], params.wave[1], {disableNormalization: true});
                        osc.setPeriodicWave(wave);
                    }
                    else {
                        osc.type = params.type;
                    }
                    //create frequency gain stage and
                    const gainStage = proxy.audioEndpoints[frequencyKey] = proxy.gainStage[frequencyKey] = proxy.context.createGain();    
                    osc.connect(gainStage)
                }

                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                if(Array.isArray(frequency)){
                    //frequency array initialization
                    for(let f of frequency){
                        initFreq(f);    
                    }
                }
                else{
                    initFreq(frequency);
                }
                
            },

            start: (time: number, options?: any) => {

                //worker function
                const startFreq = (frequency:number) => {
                    const frequencyKey = Math.round(frequency*100)
                    proxy.attenuate([frequencyKey])
                    if(frequency!==undefined){
                        proxy.oscillators[frequencyKey].frequency.setValueAtTime(frequency, time)
                    }
                    proxy.oscillators[frequencyKey].start(time);
                    proxy.oscillatorState[frequencyKey] = 1;
                    if(params.duration!==undefined){
                        proxy.oscillators[frequencyKey].stop(time + params.duration);
                    }
                }

                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                if(Array.isArray(frequency)){
                    //frequency array start
                    for(let f of frequency){
                        startFreq(f);    
                    }
                }
                else{
                    startFreq(frequency);
                }
            },

            stop: (options?: any) => {

                //worker function
                const stopFreq = (frequency:number) => {
                    const frequencyKey = Math.round(frequency*100)
                    if(proxy.oscillators[frequencyKey]){
                        proxy.oscillators[frequencyKey].stop();
                    }
                    proxy.oscillatorState[frequencyKey] = 0;
                }

                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                if(Array.isArray(frequency)){
                    //frequency array start
                    for(let f of frequency){
                        stopFreq(f);    
                    }
                }
                else{
                    stopFreq(frequency);
                }

            }

        });

        this.$type = 'Oscillator';
        this.staticEndpoints = true;      

        this.oscillators = {};
        this.oscillatorState = {};
        this.gainStage = {};
        
        proxy = this;

    }

    attenuate(additionalFrequencyKeys: string[]) {

        const activeKeys = Object.keys(this.oscillatorState).filter(key => this.oscillatorState[key] === 1)
        const voiceCount = activeKeys.length + additionalFrequencyKeys.length

        const partialGain = MAX_TOTAL_GAIN / voiceCount

        for(let key of activeKeys.concat(additionalFrequencyKeys)){
            this.gainStage[key].gain.value = partialGain
        }

    }
    
}

export default OscillatorModule;