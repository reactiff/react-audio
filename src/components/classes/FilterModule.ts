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
            init: () => {
                proxy.audioEndpoint = proxy.context.createBiquadFilter();
                proxy.audioEndpoint.type = FilterTypeValue[params.type.toString()];
                proxy.audioEndpoint.frequency.value = params.frequency || 1000;
                proxy.audioEndpoint.Q.value = params.Q || 100;
                proxy.audioEndpoint.gain.value = params.gain || 1;
            }
        });

        this.$type = 'Filter';
        
        proxy = this;

    }
}

export default FilterModule;