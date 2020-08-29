import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

export enum FilterType {
    lowpass,
    highpass,
    bandpass,
    lowshelf,
    highshelf,
    peaking,
    notch,
    allpass,
} 

const FilterTypeValue:any = {
    "0": "lowpass",
    "1": "highpass",
    "2": "bandpass",
    "3": "lowshelf",
    "4": "highshelf",
    "5": "peaking",
    "6": "notch",
    "7": "allpass",
}

class FilterModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            init: (options?: any) => {

                return new Promise(resolve => {

                    if(params.off){
                        resolve();
                        return;
                    }
                    
                    const endPoint = proxy.ownEndpoints.default = proxy.context.createBiquadFilter();
                    endPoint.type = FilterTypeValue[params.type.toString()];
                    endPoint.frequency.value = params.frequency || 1000;
                    endPoint.Q.value = params.Q || 1;
                    endPoint.gain.value = params.gain || 1;
                    resolve();
                });
            }
        });

        this.$type = 'Filter';
        
        proxy = this;

    }
}

export default FilterModule;