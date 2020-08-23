import uuid from 'uuid/v4';

const STOPPED = 0;
const PLAYING = 1;
const REPEAT = 2;

const SUBSCRIPTION_EVENTS = ['onStateChange', 'onMeasureNumberChange', 'onBeat'];

export default class Playback {

    constructor(audioContext) {

        this.context = audioContext;
        this.state = STOPPED;

        this.looping = 0;

        //events
        
        this.trackBeatBindings = {};

        this.timer = null;

        this.projectRef = {};
        this.resourcesRef = {};

        this.foundationTrack = null;
        this.trackGroups = [];

        
        this.prevMeasureNumber = 0;
        this.measureNumber = 0;
        
        this.subscriptions = {};

        this.stepSelectionCallbacks = {};
        this.stepActivationCallbacks = {};

        this.initialized = false;
    }

    get tracks() {
        return this.projectRef.current.tracks;
    }
    get tempo() {
        return this.projectRef.current.tempo;
    }
    get measureCount() {
        return this.projectRef.current.bars;
    }


    setProject(projectRef) {
        this.projectRef = projectRef;
        this.foundationTrack = this.tracks.find(t=>t.foundation);
    }
    setResources(resourcesRef) {
        this.resourcesRef = resourcesRef;
    }


    getTrackData(measureNumber) {
        return this.tracks.map((track, index) => {
            const measure = track.measures[measureNumber] || track.measures[1];
            return measure;
        });
    }

    init() {

         if(this.initialized){
            return;
        }

        this.initialized = true;

        if(this.measureNumber === 0){
            this.measureNumber = 1;
            this.prevMeasureNumber = 1;
        }

        for(let i = 0; i < this.tracks.length; i++){
            const track = this.tracks[i];
            track.index = i;
            this.initTrack(track);
            
            //set selection state for each beat
            for(let j = 0; j < track.beats; j++){
                const value = track.measures[1][j];
                this.setStepSelected(i, j, value, 0, 1);
            }
        }

        //const data = this.getTrackData(1);
        //this.notify('onMeasureChange', { measureNumber: 1, data: data });
    }

    subscribe(event, callback, filter) {

        if(!SUBSCRIPTION_EVENTS.includes(event)){
            throw new Error('Invalid event')
        }

        if(!this.subscriptions[event]){
            this.subscriptions[event] = [];
        }

        const id = uuid();
        this.subscriptions[event].push({
            id: id,
            callback: callback,
            filter: filter
        });

        const unsibscribe = () => {
            for(let i = 0; i < this.subscriptions[event].length; i++){
                if(this.subscriptions[event][i].id === id){
                    this.subscriptions[event].splice(i, 1);
                    return;
                }
            }
        }

        return unsibscribe;
    }


    
    notify(event, data, filter){
        if(!SUBSCRIPTION_EVENTS.includes(event)){
            throw new Error('Invalid event')
        }

        if(this.subscriptions[event]){
            this.subscriptions[event].forEach(sub => {

                if(filter && sub.filter){

                    const filterResults = Object.keys(sub.filter).map(key => {
                        if(!filter.hasOwnProperty(key)){
                            throw new Error('Subscribed event data missing ' + key);
                        }
                        return sub.filter[key]===filter[key];
                    });

                    const someFailed = filterResults.some(r=>r!==true);
                 
                    if(someFailed){
                       return;
                    }

                    sub.callback.apply(null, Object.keys(data).map(key => data[key]));

                }
                else{
                    sub.callback.apply(null, Object.keys(data).map(key => data[key]));
                }

            })
        }
    }

   

    initTrack(track) {
        
        if(track.initialized){
            return;
        }

        
        track.id = uuid();

        if(track.inputArray){
            for(let d = 0; d < track.inputArray.length; d++){
                const input = track.inputArray[d];
                const initialData = {};
                for(let i=0; i<track.beats; i++) {
                    if(i<input.length){
                        initialData[i] = input[i] === '1';
                    }
                    else {
                        initialData[i] = false;
                    }
                }
                track.measures[d + 1] = initialData;
            }
        }
        else{
            const initialData = {};
            for(let i=0; i<track.beats; i++) {
                initialData[i] = false;
            }
            track.measures[1] = initialData;
        }
        
        track.initialized = true;
        
    }

    loop() {
        
        
        this.loopDuration = 60000 / this.tempo * 4;
        
        //group tracks with same measure and handle with one timer

        const tracks = Object.keys(this.tracks).map((key, index) => {this.tracks[key].index = index; return this.tracks[key]});
        const trackLengths = Array.from(new Set(tracks.map(track=>track.beats)));
        this.trackGroups = trackLengths.map(l => ({ 
            beats: l, 
            foundation: this.foundationTrack.beats === l ? true : false,
            indicatorTrack: tracks.find(t=>t.indicator), 
            soundTracks: tracks.filter(t => t.beats === l && !t.indicator),
            beatDuration: this.loopDuration / l
        }));

        for(let g = 0; g < this.trackGroups.length; g++) {

            const group = this.trackGroups[g]

            group.absoluteBeatIndex = 0;
            
            const playBeat = async (group) => {

                const beatIndex = this.currentBeat = group.absoluteBeatIndex % group.beats;
                
                let measureNumberChanged = false;
                if(group.foundation){
                    const absoluteMeasureNumber = (group.absoluteBeatIndex - beatIndex) / group.beats;
                    const measureNumber = absoluteMeasureNumber % this.measureCount + 1;
                    if(this.measureNumber !== measureNumber){

                        this.measureNumber = measureNumber;

                        this.currentMeasure = this.getTrackData(measureNumber);

                        //get current measure for each track
                        this.notify('onMeasureNumberChange', { measureNumber: measureNumber });

                        
                        
                    }
                }

                if(!this.currentMeasure){
                    this.currentMeasure = this.getTrackData(this.measureNumber);
                }

                //activate segment
                //this.notify('onBeat', {currentMeasure: this.currentMeasure, beatIndex: beatIndex, duration: group.beatDuration });
                
                //trigger sounds
                group.soundTracks.forEach(st => {

                    if(this.prevMeasureNumber !== this.measureNumber){
                        this.compareAndUpdateBeatStates(this.prevMeasureNumber, this.measureNumber, st.index, beatIndex);
                    }

                    

                    const measure = st.measures[this.measureNumber] || st.measures[1];
                    
                    // st.currentBeat = beatIndex;
                    

                    if(measureNumberChanged){
                        //debugger

                        // st.currentMeasure = measure;
                        // st.processMeasure();
                        
                        // this.notify('onStateChange', {value: this.state})


                        // const objectsAreEqual = (a, b) => {

                        //     if(!a && b || !b && a){
                        //         return false;
                        //     }

                        //     const akeys = Object.keys(a);
                        //     const bkeys = Object.keys(b);

                        //     if(akeys.length !== bkeys.length){
                        //         return false;
                        //     }

                        //     const keyMatches = Object.keys(a).map(key => {
                        //         if(!b.hasOwnProperty(key)){
                        //             return false;
                        //         }
                        //         return a[key]===b[key];
                        //     });
        
                        //     const someFailed = keyMatches.some(r => r !== true);

                        //     return !someFailed;
                        // }

                        //this.notify('onMeasureData', {trackId: st.id, value: measure});
                        
                        
                    }
                    
                    //trigger instrument
                    
                    if(measure[beatIndex]){

                        if(st.instrumentName){
                            const inst = this.resourcesRef.current.instruments[st.instrumentName];
                            if(inst) {
                                inst.trigger();
                            }
                        }
                        
                        this.stepActivated(st.index, this.measureNumber, beatIndex, group.beatDuration);
                        
                        
                    }


                    //st.processBeat(group.beatDuration);

                    //activate segment
                    //if(this.trackBeatBindings[st.id + ':' + beatIndex]) {
                    //    this.trackBeatBindings[st.id + ':' + beatIndex](beatDuration);
                    //}
                })

                this.prevMeasureNumber = this.measureNumber;

                // if(group.foundation && group.indicatorTrack){
                    // group.indicatorTrack.processBeat(beatDuration);
                    // if(this.trackBeatBindings['indicator' + ':' + beatIndex]) {
                    //     this.trackBeatBindings['indicator' + ':' + beatIndex](beatDuration);
                    // }
                // }
            
                //repeat measure
                if(this.state===REPEAT && group.foundation && (group.absoluteBeatIndex + 1) % group.beats === 0){
                    group.absoluteBeatIndex -= group.beats - 1;
                }
                else {
                    group.absoluteBeatIndex++;
                }
                
                
            }

            this.measureNumber = 1;

            group.timer = setInterval(playBeat, group.beatDuration, group);

            playBeat(group);

        }

    }
    
    trigger() {

        this.init();

        if(this.state === STOPPED){
            this.state =  PLAYING;  
            
            this.measureNumber = 1;
            this.prevMeasureNumber = 1;
            //get current measure for each track
            this.notify('onMeasureNumberChange', { measureNumber: this.measureNumber });
        }
        else if(this.state === REPEAT){
            this.state = PLAYING;   
        }
        else if(this.state === PLAYING) {
            this.state = STOPPED;
        }
        
        this.notify('onStateChange', {value: this.state})
        
        if(this.state === PLAYING || this.state === REPEAT){

            if(!this.looping){
                this.looping = true;
                this.loop();
            }
            
        }
        else{
            for(let i = 0; i<this.trackGroups.length; i++) {
                clearInterval(this.trackGroups[i].timer);
            }
            this.looping = false;
        }
    }

    setMeasureCount(count){
        this.measureCount = count;
    }

    

    setNoteSelected(trackIndex, beatIndex, value){

        let stateChanged = this.state !== REPEAT ? true : false;
        
        //right now, we want to start repeating the measure as soon as it starts being edited
        this.state = REPEAT;
        

        //DELETE THIS IF IT WORKS ! !!!

        if(this.tracks[trackIndex].instrument){
            this.tracks[trackIndex].instrument.resume();
        }
        
        //create a copy of new measure
        let measure = this.tracks[trackIndex].measures[this.measureNumber];
        if(!measure){

            this.tracks[trackIndex].measures[this.measureNumber] = {};
            Object.assign(this.tracks[trackIndex].measures[this.measureNumber], this.tracks[trackIndex].measures[1]);

            measure = this.tracks[trackIndex].measures[this.measureNumber];

            //DELETE THIS IF IT WORKS ! !!!
             
            //for(let i = 0; i < this.tracks.length; i++) {
                // const initialData = {};
                // for(let j=0; j < track.beats; j++) { 
                //     initialData[j] = false; 
                // }
                // Object.assign(initialData, track.measures[1]);
                // track.measures[measureNumber] = initialData;
            //}

            
        }

        //track.currentMeasure = track.measures[measureNumber];

        //toggle the note
        //track.currentMeasure[beatIndex] = !track.currentMeasure[beatIndex];

        measure[beatIndex] = value;
        
        // if(measureNumber === 2){
        //     debugger;
        // }

        //const data = this.getTrackData(measureNumber);

        //stepSelected(track.index, beatIndex, stepSelected);

        if(stateChanged){
            this.notify('onStateChange', {value: this.state})
        }
        
    }

    compareAndUpdateBeatStates(prevMeasureNum, curMeasureNum, trackIndex, currentBeat) {
        
        const prevMeasure = this.tracks[trackIndex].measures[prevMeasureNum] || this.tracks[trackIndex].measures[1];
        const curMeasure = this.tracks[trackIndex].measures[curMeasureNum] || this.tracks[trackIndex].measures[1];

        for(let i=0; i<this.tracks[trackIndex].beats; i++){
            const prevValue = prevMeasure[i];
            const value = curMeasure[i];
            if(prevValue !== value){
                this.setStepSelected(trackIndex, i, value, currentBeat, curMeasureNum);
            }
        }
        
    }

    setStepSelected(trackIndex, beatIndex, value, currentBeat, measureNumber){
        this.stepSelectionCallbacks[trackIndex + '-' + beatIndex](value, currentBeat, measureNumber);
    }
    onStepSelected(trackIndex, beatIndex, callback) {
        this.stepSelectionCallbacks[trackIndex + '-' + beatIndex] = callback;
        const unsibscribe = () => {
            delete this.stepSelectionCallbacks[trackIndex + '-' + beatIndex];
        }
        return unsibscribe;
    }

    stepActivated(trackIndex, measureNumber, beatIndex, duration){
        if(this.stepActivationCallbacks[trackIndex + '-' + beatIndex]){
            this.stepActivationCallbacks[trackIndex + '-' + beatIndex](duration, measureNumber);
        }
    }
    onStepActivated(trackIndex, beatIndex, callback) {
        this.stepActivationCallbacks[trackIndex + '-' + beatIndex] = callback;
        const unsibscribe = () => {
            delete this.stepActivationCallbacks[trackIndex + '-' + beatIndex];
        }
        return unsibscribe;
    }

    //
    // subscribeTrackBeat(trackId, beatIndex, callback){
    //     this.trackBeatBindings[trackId + ':' + beatIndex] = callback;
    // }
    // unsubscribeTrackBeat(trackId, beatIndex){
    //     delete this.trackBeatBindings[trackId + ':' + beatIndex];
    // }

}