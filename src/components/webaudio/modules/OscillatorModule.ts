import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';


const MAX_TOTAL_GAIN = 0.75

class OscillatorModule extends BaseAudioGraphNodeModule {


    oscillators: any;
    oscillatorState: any;
    gainStage: any;
    
    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init:  (options?: any) => {

                //create new oscillator

                const frequency = options && options.frequency || params.frequency;
                
                //worker function
                const frequencyKey = Math.round(frequency*100);
                //proxy.attenuate([frequencyKey]);
                
                //if this frequency already exists, get out
                // if(proxy.polyphonic && proxy.oscillators[frequencyKey]){
                //     return;
                // }

                //const osc = proxy.audioEndpoints[frequencyKey] = proxy.oscillators[frequencyKey] = proxy.context.createOscillator();
                const osc = proxy.audioEndpoints[frequencyKey] = proxy.context.createOscillator();

                if(params.wave){
                    var wave = proxy.context.createPeriodicWave(params.wave[0], params.wave[1], {disableNormalization: true});
                    osc.setPeriodicWave(wave);
                }
                else {
                    osc.type = params.type;
                }

                // if(proxy.polyphonic) {
                //     //create frequency gain stage and
                //     const gainStage = proxy.audioEndpoints[frequencyKey] = proxy.context.createGain();    
                                    
                //     osc.connect(gainStage);
                // }
                
            },

            start: (time: number, options?: any) => {


                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                const frequencyKey = Math.round(frequency*100)

                // if(proxy.polyphonic && proxy.oscillatorState[frequencyKey]){
                //     return;
                // }

                // const velocity = options && options.velocity || params.velocity || 1;
                // const attackGain = velocity;

                //proxy.attenuate([frequencyKey])
                proxy.audioEndpoints[frequencyKey].frequency.setValueAtTime(frequency, time)

                // if(proxy.polyphonic){
                //     proxy.audioEndpoints[frequencyKey].gain.setValueAtTime(attackGain, time);
                // }
                
                proxy.audioEndpoints[frequencyKey].start(time);

                //oscillator state
                //proxy.oscillatorState[frequencyKey] = 1;

                if(params.duration!==undefined){

                    // if(proxy.polyphonic){
                    //     proxy.audioEndpoints[frequencyKey].gain.setTargetAtTime(0, time + params.duration, 0.05);
                    // }
                    
                    proxy.audioEndpoints[frequencyKey].stop(time + params.duration)
                    
                    // if(proxy.polyphonic){
                    //     //cleanup
                    //     delete proxy.oscillators[frequencyKey]
                    //     proxy.oscillatorState[frequencyKey] = 0;
                    // }
                }
                
            },

            stop: (options?: any) => {

                //parameteric frequency
                const frequency = options && options.frequency || params.frequency
                
                //worker function
                const frequencyKey = Math.round(frequency*100)

                // if(proxy.polyphonic){
                //     if(!proxy.oscillators[frequencyKey]){
                //         return;
                //     }
                // }

                if(proxy.audioEndpoints[frequencyKey]){
                    const time = audioContext.currentTime;

                    // if(proxy.polyphonic){
                    //     proxy.audioEndpoints[frequencyKey].gain.setTargetAtTime(0, time, 0.05);
                    // }

                    proxy.audioEndpoints[frequencyKey].stop(time)
                }

                // if(proxy.polyphonic){
                //     delete proxy.oscillators[frequencyKey]
                //     //oscillator state
                //     proxy.oscillatorState[frequencyKey] = 0;
                // }

            },

            // getAudioParam: (name: string): any[] => {
            //     if(name==='gain'){ // get gain stage params
            //         return Object.keys(this.audioEndpoints).map(key => this.audioEndpoints[key][name]);
            //     }
            //     else{
            //         return Object.keys(this.oscillators).map(key => this.oscillators[key][name]);
            //     }
            // },

            // initMulti_NOT_USING: (options?: any) => {
                
            //     //worker function
            //     const initFreq = (frequency:number) => {

            //         const frequencyKey = Math.round(frequency*100)
            //         //see if there is an oscillator with this frequency already
            //         if(proxy.oscillators[frequencyKey]){
            //             //see if its on, and stop it...
            //             if(proxy.oscillatorState[frequencyKey]){
            //                 proxy.oscillators[frequencyKey].stop();
            //                 proxy.oscillatorState[frequencyKey] = 0;
            //             }
            //         }

            //         //create new oscillator
            //         const osc = proxy.oscillators[frequencyKey] = proxy.context.createOscillator();
            //         if(params.wave){
            //             var wave = proxy.context.createPeriodicWave(params.wave[0], params.wave[1], {disableNormalization: true});
            //             osc.setPeriodicWave(wave);
            //         }
            //         else {
            //             osc.type = params.type;
            //         }

            //         //create frequency gain stage and
            //         const gainStage = proxy.audioEndpoints[frequencyKey] = proxy.gainStage[frequencyKey] = proxy.context.createGain();    
            //         osc.connect(gainStage)
            //     }

            //     //parameteric frequency
            //     const frequency = options && options.frequency || params.frequency
            //     if(Array.isArray(frequency)){
            //         //frequency array initialization
            //         for(let f of frequency){
            //             initFreq(f);    
            //         }
            //     }
            //     else{
            //         initFreq(frequency);
            //     }
                
            // },

            // getAudioParam: (name: string): any[] => {
            //     return Object.keys(this.oscillators).map(key => this.oscillators[key][name]);
            // },

            // startMulti_NOT_USED: (time: number, options?: any) => {

            //     //worker function
            //     const startFreq = (frequency:number) => {
            //         const frequencyKey = Math.round(frequency*100)
            //         proxy.attenuate([frequencyKey])
            //         if(frequency!==undefined){
            //             proxy.oscillators[frequencyKey].frequency.setValueAtTime(frequency, time)
            //         }
            //         proxy.oscillators[frequencyKey].start(time);
            //         proxy.oscillatorState[frequencyKey] = 1;
            //         if(params.duration!==undefined){
            //             proxy.oscillators[frequencyKey].stop(time + params.duration);
            //         }
            //     }

            //     //parameteric frequency
            //     const frequency = options && options.frequency || params.frequency
            //     if(Array.isArray(frequency)){

            //         debugger
            //         //frequency array start
            //         for(let f of frequency){
            //             startFreq(f);    
            //         }
            //     }
            //     else{
            //         startFreq(frequency);
            //     }
            // },

            // stopMulti_NOT_USED: (options?: any) => {

            //     //worker function
            //     const stopFreq = (frequency:number) => {
            //         const frequencyKey = Math.round(frequency*100)
            //         if(proxy.oscillators[frequencyKey]){
            //             proxy.oscillators[frequencyKey].stop();
            //         }
            //         proxy.oscillatorState[frequencyKey] = 0;
            //     }

            //     //parameteric frequency
            //     const frequency = options && options.frequency || params.frequency
            //     if(Array.isArray(frequency)){
            //         //frequency array start
            //         for(let f of frequency){
            //             stopFreq(f);    
            //         }
            //     }
            //     else{
            //         stopFreq(frequency);
            //     }

            // }

        });

        this.$type = 'Oscillator';
        this.staticEndpoints = false;      

        //this.polyphonic = params.polyphonic;

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