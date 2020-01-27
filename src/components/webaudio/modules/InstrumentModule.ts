import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class InstrumentModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
            
        let proxy: any = null;

        super(target, audioContext, params, {

            //Instrument
            trigger: async (options?: any | null) => {

                const opt = options || {}

                //init all
                await this.init(opt);
                await this.connect();
        
                let autoReleaseDelayMs;
                
                if(params.autoRelease){
                    if(typeof params.duration === 'undefined'){
                        throw new Error(params.name + ' missing duration prop, required for autoRelease')
                    }
                    autoReleaseDelayMs = params.duration * 1000
                } 

                return this.start(this.context.currentTime, opt, autoReleaseDelayMs);
        
            }, 

            //Instrument
            stop: async (options?: any | null) => {
                
                // stop sources
                for(let src of this.sources){
                    src.stop(options);
                }

        
            }

            

        });

        // if(params.signalSource) {
        //     if(params.signalSource.function.toLowerCase() === 'primes'){
        //         const {range} = params.signalSource.options;
        //         this.signalSource = new Primes(range[0], range[1]);
        //     }
        // }



        this.$type = 'Instrument';

        proxy = this;
        
    }
}

export default InstrumentModule;