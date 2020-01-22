import uuid from 'uuid/v4';

const STOPPED = 0;
const PLAYING = 1;
const REPEAT = 2;

const SUBSCRIPTION_EVENTS = ['onStateChange', 'onMeasureChange', 'onMeasureData'];

export default class Playback {

    constructor(audioContext) {

        this.context = audioContext;
        this.state = STOPPED;

        this.looping = 0;

        //events
        
        this.trackBeatBindings = {};

        this.timer = null;

        this.tracks = {};
        this.foundationTrack = null;
        this.trackGroups = [];

        this.tempo = 138;
        this.measureCount = 2;
        this.measureNumber = 0;
        
        this.subscriptions = {}
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

    notify(event, data){
        if(!SUBSCRIPTION_EVENTS.includes(event)){
            throw new Error('Invalid event')
        }

        if(this.subscriptions[event]){
            this.subscriptions[event].forEach(sub => {

                if(sub.filter){

                    const filterResults = Object.keys(sub.filter).map(key => {
                        if(!data.hasOwnProperty(key)){
                            throw new Error('Subscribed event data missing ' + key);
                        }
                        return sub.filter[key]===data[key];
                    });

                    const someFailed = filterResults.some(r=>r!==true);
                 
                    if(someFailed){
                       return;
                    }

                    sub.callback(data.value);

                }
                else{
                    sub.callback(data.value);
                }

            })
        }
    }

    /**
     * Private method
     * @param measureNumber 
     */
    _setMeasureNumber(measureNumber) {
        if(measureNumber !== this.measureNumber){
            this.measureNumber = measureNumber;
            this.notify('onMeasureChange', {value: measureNumber});
        }
    }

    initTrack(track) {
        
        if(track.initialized){
            return;
        }

        track.initialized = true;

        if(this.measureNumber === 0){
            this.measureNumber = 1;
        }

        const initialData = {};
        for(let i=0; i<track.beats; i++) {
            initialData[i] = false;
        }
        track.measures[1] = initialData;
        track.currentMeasure = track.measures[1];
        track.currentBeat = 0;
        
    }

    loop() {

        const loopDuration = 60000 / this.tempo * 4;

        //group tracks with same measure and handle with one timer

        const tracks = Object.keys(this.tracks).map((key, index) => {this.tracks[key].index = index; return this.tracks[key]});
        const trackLengths = Array.from(new Set(tracks.map(track=>track.beats)));
        this.trackGroups = trackLengths.map(l => ({ 
            beats: l, 
            foundation: this.foundationTrack.beats === l ? true : false,
            indicatorTrack: tracks.find(t=>t.indicator), 
            soundTracks: tracks.filter(t => t.beats === l && !t.indicator)
        }));

        for(let g = 0; g < this.trackGroups.length; g++) {

            const group = this.trackGroups[g]

            group.absoluteBeatIndex = 0;

            const beatDuration = loopDuration / this.foundationTrack.beats; // group.beats;
            
            const playBeat = (group) => {

                const beatIndex = group.absoluteBeatIndex % group.beats;

                let measureNumberChanged = false;

                if(group.foundation){
                    const absoluteMeasureNumber = (group.absoluteBeatIndex - beatIndex) / group.beats;
                    const measureNumber = absoluteMeasureNumber % this.measureCount + 1;

                    if(this.measureNumber !== measureNumber){
                        measureNumberChanged = true;
                    }
                    this._setMeasureNumber(measureNumber) 
                }
                
                //trigger sounds
                group.soundTracks.forEach(st => {

                    // if(!st.currentMeasure) {
                    //     const initialData = {};
                    //     for(let i=0; i<st.beats; i++) {
                    //         initialData[i] = false;
                    //     }
                    //     st.currentMeasure = initialData;
                    // }

                    const measure = st.measures[this.measureNumber] || st.measures[1];
                    
                    
                    st.currentBeat = beatIndex;
                    

                    if(measureNumberChanged){
                        //debugger

                        st.currentMeasure = measure;
                        st.processMeasure();
                        
                        this.notify('onStateChange', {value: this.state})


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
                    if(st.currentMeasure[beatIndex]){
                        if(st.instrument){
                            st.instrument.trigger();
                        }
                    }

                    
                    //activate segment
                    st.processBeat(beatDuration);

                    //activate segment
                    //if(this.trackBeatBindings[st.id + ':' + beatIndex]) {
                    //    this.trackBeatBindings[st.id + ':' + beatIndex](beatDuration);
                    //}
                })

                if(group.foundation && group.indicatorTrack){
                    // group.indicatorTrack.processBeat(beatDuration);
                    // if(this.trackBeatBindings['indicator' + ':' + beatIndex]) {
                    //     this.trackBeatBindings['indicator' + ':' + beatIndex](beatDuration);
                    // }
                }
            
                //repeat measure
                if(this.state===REPEAT && group.foundation && (group.absoluteBeatIndex + 1) % group.beats === 0){
                    group.absoluteBeatIndex -= group.beats - 1;
                }
                else {
                    group.absoluteBeatIndex++;
                }
                
                
            }

            this._setMeasureNumber(1);

            group.timer = setInterval(playBeat, beatDuration, group);

            playBeat(group);

        }

    }
    
    trigger() {

        if(this.state === STOPPED){
            const someTracksHaveFirstMeasure = this.tracks.some(t => t.measures[1] !== undefined);
            if(!someTracksHaveFirstMeasure){
                this.state =  REPEAT;    
            }
            else{
                this.state =  PLAYING;    
            }
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

    setTracks(tracks) {
        this.tracks = tracks;
        this.foundationTrack = this.tracks.find(t=>t.foundation);

        for(let track of tracks){
            this.initTrack(track);
        }
    }

    toggleNote(trackId, beatIndex){

        this.state = REPEAT;
        
        const track = this.tracks.find(x=>x.id === trackId);
        
        if(track.instrument){
            track.instrument.resume();
        }
        
        //create a copy if new measure
        let measure = track.measures[this.measureNumber];
        if(!measure){
            const initialData = {};
            for(let i=0; i<track.beats; i++) {
                initialData[i] = false;
            }
            Object.assign(initialData, track.measures[1]);
            measure = track.measures[this.measureNumber] = initialData;
        }

        track.currentMeasure = measure;

        //toggle the note
        track.currentMeasure[beatIndex] = !track.currentMeasure[beatIndex];
        
        

        

        track.processMeasure();

        this.notify('onStateChange', {value: this.state})
        
        
    }

    //
    // subscribeTrackBeat(trackId, beatIndex, callback){
    //     this.trackBeatBindings[trackId + ':' + beatIndex] = callback;
    // }
    // unsubscribeTrackBeat(trackId, beatIndex){
    //     delete this.trackBeatBindings[trackId + ':' + beatIndex];
    // }

}