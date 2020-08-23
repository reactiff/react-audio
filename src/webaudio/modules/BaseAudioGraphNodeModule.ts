import uuid from 'uuid/v4'
import Log from './Log';

class BaseAudioGraphNodeModule {
    
    $type: string = 'BaseAudioGraphNodeModule';
    $params: any;
    
    name: string;

    id: string;

    // audioEndpoint: any; // single endpoint no more
    // inputEndpoints: any[] = []; // rename...
    audioEndpoints: any = {}; // From now on, everything has multiple endpoints
    staticEndpoints: boolean = false;
    polyphonic: boolean = false;
    target: any;
    context: any;
    operations: any;
    sources: any[] = [];
    listeners: any[] = [];
    inputSources: any[] = [];
    binding: any;
    autoRelease?: boolean;
    signalSource: any;
    frequencyArray: number[] = [];
    
    constructor(
        target: any, 
        audioContext: any, 
        params: any, 
        operations: any) 
    {
        this.id = params.id || uuid();
        this.target = target;
        this.context = audioContext;
        this.$params = params;
        this.operations = operations;
        this.name = params.name;
    }

    getAudioParam(name: string): any[] {
        if(this.operations.getAudioParam){
            return this.operations.getAudioParam(name);
        }
        return Object.keys(this.audioEndpoints).map(key => this.audioEndpoints[key][name]);
    }

    getDescription() {
        const tokens = [];
        if (this.name) tokens.push(this.name);
        if (this.$params.purpose) tokens.push(this.$params.purpose);
        const description = tokens.join('/');
        return this.$type + (description ? '[' + description + ']' : '');
    }

    async init(options?: any | null) {
        const thisModule =  this;
        return new Promise(async (resolve) => {

            Log.initialization(thisModule, options);

            if(!thisModule.staticEndpoints){
                thisModule.audioEndpoints = {}; // do not reset, some nodes mainain persistent instances
            }

            if(thisModule.operations.init){
                await thisModule.operations.init(options);
            }

            //if (thisModule.listeners.length) debugger;
            
            await Promise.all(thisModule.sources.map((source: BaseAudioGraphNodeModule) => source.init(options)));
            await Promise.all(thisModule.listeners.map((listener: any) => listener.init(options)));

            resolve();
        });
    }

    passThrough(source: any) {

        if (this.$type === 'StreamPlayer') debugger;

        debugger;

        // I am not sure this works correctly.  This methods calls itself on the target.  So when does a target  actually connect the source to it's endpoint?  I think this should only happen on the first cycle, and the next node should receive the source.  But then, we can implement the skip inside the receive function.

        Log.passThrough(this, source);

        //unlike receive method, passthrough method patches the connection thru to the target's audionode, whereas receive, enqueues connections preparing for them to be made when its time
        //the goal here is to connect directly to the first AudioNode we find crawling upstream

        const thisModule =  this;

        if(Object.keys(this.audioEndpoints).length){

            debugger // WHY ARE WE HERE? This logic does not jive with the above description of PATCHING THRU

            const incomingEndpoints = source.getEndPoints();
            for(let incoming of incomingEndpoints){
                for(let ep of this.audioEndpoints){
                    incoming.connect(ep);
                }
            }

        }
        else if(this.target && this.target.passThrough){
            this.target.passThrough(source);
        }

        //if (this.listeners.length) debugger;

        for(let d of this.listeners){
            d.passThrough(source);
        }

    }

    receive(source: any) {

        Log.receive(this, source);

        const thisModule =  this;

        return new Promise(async (resolve) => {

            let inputEndpoints;
            //let sourceDescriptor;

            thisModule.inputSources.push(source);

            if(source instanceof AudioNode){
                //sourceDescriptor = 'AudioNode';
                inputEndpoints = [source];
            }
            else{
                //sourceDescriptor = source.getDescription();
                inputEndpoints = source.getEndPoints();
            } 

            //if(thisModule.audioEndpoint){ //this used to check if module has an audio endpoint

            // The received source should be connected to local endPoints, not become endPoints.


            // if(Object.keys(thisModule.audioEndpoints).length) {

            for(let input of inputEndpoints){
                for(let key of Object.keys(thisModule.audioEndpoints)){
                    input.connect(thisModule.audioEndpoints[key]);
                }
            }
                
            // }
            // else{

                
            // for(let input of inputEndpoints){

            //     const key = input.id || Object.keys(thisModule.audioEndpoints).length;
            //     thisModule.audioEndpoints[key] = input;
            // }
                
            // }

            resolve();

        });
    }

    async connect() {

        // if (this.$type === 'StreamPlayer') debugger;

        const thisModule =  this;

        return new Promise(async (resolve)=>{
            
            
            

            
            for(let src of thisModule.sources){
                await src.connect();
            }

            if(thisModule.operations.connect) {
                thisModule.operations.connect();
            }
            else{
                await thisModule.target.receive(thisModule);
            }

            for(let d of thisModule.listeners){
                await d.receive(thisModule);
            }

            
            
            resolve();
        });
        
    }

    start(time: number, options?: any, autoReleaseDelayMs?: number) {


        // if (this.$type === 'StreamPlayer') debugger;

        Log.start(this, time, options);

        if(this.operations.start){
            this.operations.start(time, options);
        }
        
        // start sources
        for(let src of this.sources){
            src.start(time, options);
        }

        const thisModule: any = this;

        if(typeof autoReleaseDelayMs !== 'undefined'){
            setTimeout(opt => thisModule.stop(opt), autoReleaseDelayMs, options)
        }

        //return release call
        return () => thisModule.stop(options);

    }

    stop(options?: any) {

        Log.stop(this, options);

        if(this.operations.stop){
            this.operations.stop(options);
        }
        
        // stop sources
        for(let src of this.sources){
            src.stop(options);
        }

    }

    async trigger(options?: any | null) {
        return await this.operations.trigger(options);
    }

    
    async resume() {

        this.context.resume();

    }

    async registerBinding(source: any) {
        await this.target.registerBinding(source);
    }

    async registerSource(source: any) {

        Log.registerSource(this, source);

        this.sources.push(source);

        if(source.binding){
            await this.target.registerBinding(source);
        }

    }

    async registerListener(aux: any) {

        this.listeners.push(aux);
        
    }

    getEndPoints() {
        if(this.operations.getEndPoints){
            return this.operations.getEndPoints();
        }
        return Object.keys(this.audioEndpoints).map(key => this.audioEndpoints[key]);
    }

    traverseSources(test: {(node:any): boolean}, select:{(node:any): void}){

        for(let src of this.sources){
        
            if(test(src)){
                select(src);
            }

            src.traverseSources(test, select);
        
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
    findParent(type: string, name?:string){
        if(name){
            return this.findParentByTypeAndName(type, name);
        }
        return this.findParentByType(type);
    }

}


export default BaseAudioGraphNodeModule;