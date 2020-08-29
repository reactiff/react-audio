import uuid from 'uuid/v4'
import Log from './Log';

type Dictionary = { [index: string]: any };

class BaseAudioGraphNodeModule {
    
    $type: string = 'BaseAudioGraphNodeModule';
    $params: any;
    
    name: string | null = null;
    purpose: string | null = null;

    id: string;
    $tag: string;
    
    ownEndpoints: Dictionary = {};
    receivedEndpoints: Dictionary = {};

    // staticEndpoints: boolean = false;
    polyphonic: boolean = false;
    target: any;
    context: any;
    operations: any;

    sources: any = {};
    listeners: any = {};
    inputSources: any = {};

    initializedParams: { [index: string]: boolean } = {};

    binding: any;
    signalSource: any;
    frequencyArray: number[] = [];
    adsr: { a: number, d: number, s: number, r: number } = { a: 0, d: 0, s: 0.8, r: 0.2 };

    constructor(
        target: any, 
        audioContext: any, 
        params: any, 
        operations: any) 
    {
        this.target = target;
        this.context = audioContext;
        this.$params = params;
        this.operations = operations;

        // set all properties using params
        const _this: { [index: string]: any } = this;
        for (let key in params) {
            const p = params[key];
            if (typeof p !== 'undefined') {
                if (typeof p === 'object') {
                    if (_this[key]) {
                        // allow partial params i.e. copy base then assign available keys only
                        const object = _this[key] ? {..._this[key]} : {};
                        Object.assign(object, p);
                        _this[key] = object;    
                    }
                    else {
                        _this[key] = p;
                    }
                }
                else {
                    _this[key] = p;
                }
            }   
        }

        this.id = params.id || uuid();
        this.$tag = params.tag;

    }

    getValue() {
        return this.$params.value;
    }

    getAudioParam(name: string): any[] {
        if(this.operations.getAudioParam){
            return this.operations.getAudioParam(name);
        }
        return Object.keys(this.ownEndpoints).map((key: string) => this.ownEndpoints[key][name]);
    }

    getDescription() {
        const tokens = [];
        if (this.name) tokens.push(this.name);
        if (this.$params.purpose) tokens.push(this.$params.purpose);
        const description = tokens.join('/');
        return this.$type + (description ? '[' + description + ']' : '');
    }

    getShortDescription() {
        if (this.name) return this.name;
        if (this.$params.purpose) return this.$params.purpose;
        return this.$type;
    }

    init(options?: any | null) {

        const thisModule =  this;
        return new Promise(async (resolve) => {

            // Log.initialization(thisModule, options);

            thisModule.ownEndpoints = {}; 
            thisModule.inputSources = {};
            thisModule.initializedParams = {};
            
            if(thisModule.operations.init){
                await thisModule.operations.init(options);
            }
            
            await Promise.all(
                Object.values(thisModule.sources).map(
                    (source: any) => source.init(options)
                )
            );

            await Promise.all(
                Object.values(thisModule.listeners).map(
                    (listener: any) => listener.init(options)
                )
            );


            if (thisModule.target && thisModule.target.$type === 'AudioGraph' && thisModule.$type === 'Instrument') {
                await thisModule.target.init(options);
            }

            resolve();
        });
    }

    passThrough(source: BaseAudioGraphNodeModule) {

        Log.passThrough(this, source);

        // If this node has a target, pass the source through to it
        if(this.target && this.target.passThrough){
            this.target.passThrough(source);
        }
        else if(Object.keys(this.ownEndpoints).length){

            // otherwise connect to own endpoints
            debugger;

            const sourceEndpoints = source.getEndPoints();
            for(let sourceEndpoint of sourceEndpoints){
                for(let ownEndpoint of Object.values(this.ownEndpoints)){
                    sourceEndpoint.connect(ownEndpoint);
                }
            }

        }

        for(let d of Object.values(this.listeners)){
            (d as BaseAudioGraphNodeModule).passThrough(source);
        }

    }

    receive(source: any) {

        //if (this.$type === 'Param') debugger;

        Log.receive(this, source);

        const thisModule =  this;

        return new Promise(async (resolve) => {
   
            if (thisModule.inputSources.hasOwnProperty(source.id)) {

                // make sure that the source doesn't have any new endpoints
                debugger;

                resolve();
                return;
            }

            thisModule.inputSources[source.id] = source;

            let sourceEndpoints;
            let description;
            if(source instanceof AudioNode){
                description = typeof source;
                sourceEndpoints = [source];
            }
            else{
                description = source.getShortDescription();
                sourceEndpoints = source.getEndPoints();
            } 


            const ownEndPoints = Object.values(thisModule.ownEndpoints);
            if(ownEndPoints.length) {
                for(let sourceEp of sourceEndpoints){
                    for(let ownEp of ownEndPoints) {

                        // Log.write(' connect ' + source + '.' + key + ' -- to --> ' + thisModule.getDescription());
                        sourceEp.connect(ownEp);
                    }
                }
            } else {
                let j = sourceEndpoints.length;
                while (j--) {
                    let sourceEp = sourceEndpoints[j];
                    const key =  description;
                    thisModule.receivedEndpoints[key] = sourceEp;
                }
                
            }

            resolve();

        });
    }

    connect() {

        const thisModule =  this;

        return new Promise(async (resolve)=>{

            console.log(this.getShortDescription() + ' -> BEGIN connect()');
            
            // tell sources to make connections
            for(let src of Object.values(thisModule.sources)) {
                await (src as BaseAudioGraphNodeModule).connect().catch(reason => {
                    debugger;
                    console.log(reason)
                });
            }

            // then connect self
            if(thisModule.operations.connect) {
                await thisModule.operations.connect().catch(
                    (reason: any) => {
                        debugger;
                        console.log(reason);
                    });
            }
            else{
                await thisModule.target.receive(thisModule).catch(
                    (reason: any) => {
                        debugger;
                        console.log(reason);
                    });
            }

            // connect to listeners
            for(let d of Object.values(thisModule.listeners)){
                await (d as BaseAudioGraphNodeModule).receive(thisModule).catch(
                    (reason: any) => {
                        debugger;
                        console.log(reason);
                    });
            }
            
            console.log(this.getShortDescription() + '   RESOLVE connect()');

            resolve();
        });
        
    }

    start(time: number, options?: any) {

        let sustained: any[] = [];
        
        // start sources
        for(let src of Object.values(this.sources)) {
            const notes = (src as BaseAudioGraphNodeModule).start(time, options);
            if (notes.length) {
                sustained = sustained.concat(notes);
            }
        }

        // then start self
        if(this.operations.start){
            const note = this.operations.start(time, options);
            if (note) {
                sustained = sustained.concat([note]);
            }
        }

        return sustained;
    }

    stop(options?: any) {

        // stop sources
        for(let src of Object.values(this.sources)){
            (src as BaseAudioGraphNodeModule).stop(options);
        }

        // then stop self
        if(this.operations.stop){
            this.operations.stop(options);
        }

    }

    evalParam(param: any, options: any, defaultValue: any) {
        const T = typeof param;
        if (T === 'undefined') return defaultValue;
        if (T !== 'string') return param;
        const f = this.$params.frequency || (options && options.frequency);
        const script = (param as string).replace(/\bf\b/g, f);;
        return window.eval(script);
    }

    // instrument only
    async trigger(options?: any | null) {
        const sustained = await this.operations.trigger(options);
        const map = sustained.reduce((a: any, b: any) => Object.assign({}, a, { [b.id]: b }), {});
        return map;
    }
    async release(options?: any | null) {
        await this.operations.release(options);
    }
        
    async resume() {
        this.context.resume();
    }

    async registerSource(source: any) {

        if (source.hasOwnProperty(source.id)) return;

        Log.registerSource(this, source);

        this.sources[source.id] = source;

        if(source.binding){
            const root: any = this.findParent(node => !!node.registerBinding);
            await root.registerBinding(source);
        }
    }
    
    async registerAsInstrument() {
        const root: any = this.findParent(node => !!node.bindChromaticInstrument);
        await root.bindChromaticInstrument(this);
    }


    async registerListener(aux: BaseAudioGraphNodeModule) {
        if (this.listeners.hasOwnProperty[aux.id]) return;
        this.listeners[aux.id] = aux;
    }

    getEndPoints() {
        if(this.operations.getEndPoints){
            return this.operations.getEndPoints();
        }
        return Object.values(this.ownEndpoints);
    }

    traverseSources(test: {(node:any): boolean}, select:{(node:any): void}){
        for(let src of Object.values(this.sources)){
            if(test(src)){
                select(src);
            }
            (src as BaseAudioGraphNodeModule).traverseSources(test, select);
        }
    }

    findParentByTypeAndName(type: string, name: string){
        if(this.$type === type && this.$params.name === name){
            return this;
        }
        if(this.target && this.target.findParentByTypeAndName){
            return this.target.findParentByTypeAndName(type, name);
        }
        return null;
    }
    findParentByType(type: string){
        if(this.$type === type){
            return this;
        }
        if(this.target && this.target.findParentByType){
            return this.target.findParentByType(type);
        }
        return null;
    }
    findParent(match: {(x: any) : boolean}) : BaseAudioGraphNodeModule | null {
        if (match(this)) {
            return this;
        }
        if (this.target) {
            return this.target.findParent(match);
        }
        return null;
    }

}


export default BaseAudioGraphNodeModule;