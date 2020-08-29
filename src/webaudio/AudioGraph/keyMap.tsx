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
            options: { 
                frequency: getChromaFrequency(key, bindings.octave), 
                octave: bindings.octave,
                sustained: bindings['sustained'][key],
            } ,
        };    
    }
    if (bindings[key]) {
        const instrument = bindings[key];
        if (typeof bindings.octave === 'undefined') {
            bindings.octave = instrument.$params.octave;
        }
        const options = isChromaKey(key) ? 
            { 
                frequency: getChromaFrequency(key, bindings.octave), 
                octave: bindings.octave,
                sustained: bindings['sustained'][key],
            } : {};

        return { 
            instrument, 
            options,
        };    
    }
    return null;
}

function adjustOctave(n: number, bindings: { [index: string]: any }) {
    if (typeof bindings.octave === 'undefined') {
        bindings.octave = 4;
    }
    bindings.octave = Math.max(bindings.octave + n, 1);
}

function processCtrlFunction(event: any, bindings: { [index: string]: any }) {
    switch(event.keyCode) {
        case 33:
            adjustOctave(1, bindings);
            break;
        case 34:
            adjustOctave(-1, bindings);
            break;
    }
}



export async function onKeyDown (event: any, bindings: { [index: string]: any }) {

    if(!event.repeat) {

        switch(event.keyCode) {
            case 33:
            case 34:
                processCtrlFunction(event, bindings);
                return;
        }

        const key = event.key.toLowerCase();        
        const keyBound = getInstrumentWithOptions(key, bindings);
        if (keyBound) {
            bindings.sustained[key] = await keyBound.instrument.trigger(keyBound.options);
        }
    }

}

export async function onKeyUp (event: any, bindings: { [index: string]: any }) {

    const key = event.key.toLowerCase();        

    const keyBound = getInstrumentWithOptions(key, bindings);
    if (keyBound && !keyBound.instrument.$params.autoRelease) {
        await keyBound.instrument.release(keyBound.options);
        delete bindings.sustained[key];
    }

}