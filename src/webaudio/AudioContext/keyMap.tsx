const chromaKeys: any = {
    z: { state: 0, frequency: 261.63 }, 
    s: { state: 0, frequency: 277.18 }, 
    x: { state: 0, frequency: 293.66 }, 
    d: { state: 0, frequency: 311.13 }, 
    c: { state: 0, frequency: 329.63 }, 
    v: { state: 0, frequency: 349.23 }, 
    g: { state: 0, frequency: 369.99 }, 
    b: { state: 0, frequency: 392 }, 
    h: { state: 0, frequency: 415.3 }, 
    n: { state: 0, frequency: 440 }, 
    j: { state: 0, frequency: 466.16 }, 
    m: { state: 0, frequency: 493.88 }, 
}

function isChromaKey(key: string){
    return chromaKeys[key]
}
function getChromaFrequency(key: string, octave: number){
    const frequencyMultiplier = 2 ** (octave - 4);
    return chromaKeys[key].frequency * frequencyMultiplier;
}

function getInstrumentWithOptions(key: string, bindings: {[index:string]: any}) {
    if (bindings['chromatic'] && isChromaKey(key)) {
        const instrument = bindings['chromatic'];
        return { 
            instrument, 
            options: { frequency: getChromaFrequency(key, instrument.$params.octave) } ,
        };    
    }
    if (bindings[key]) {
        const instrument = bindings[key];
        const options = isChromaKey(key) ? { frequency: getChromaFrequency(key, instrument.$params.octave) } : null ;
        return { 
            instrument, 
            options,
        };    
    }
    return null;
}

export function onKeyDown (event: any, bindings: { [index: string]: any }) {

    if(!event.repeat){
        const keyBound = getInstrumentWithOptions(event.key, bindings);
        if (keyBound) {
            keyBound.instrument.trigger(keyBound.options);
        }
    }
}

export function onKeyUp (event: any, bindings: { [index: string]: any }) {

    const keyBound = getInstrumentWithOptions(event.key, bindings);
    if (keyBound) {
        if(!keyBound.instrument.autoRelease){
            keyBound.instrument.stop(keyBound.options);
        }
    }
}