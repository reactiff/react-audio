import uuid from 'uuid/v4'

class BaseAudioGraphNodeModule {
    
    $type: string = 'BaseAudioGraphNodeModule';
    $params: any;
    
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
    }

    getAudioParam(name: string): any[] {
        if(this.operations.getAudioParam){
            return this.operations.getAudioParam(name);
        }
        return Object.keys(this.audioEndpoints).map(key => this.audioEndpoints[key][name]);
    }

    getDescription() {
        return this.$type;
    }

    async init(options?: any | null) {

        const thisModule =  this;

        if(!this.staticEndpoints){
            this.audioEndpoints = {}; // do not reset, some nodes mainain persistent instances
        }
        
        return new Promise(async (resolve) => {

            if(thisModule.operations.init){
                thisModule.operations.init(options);
            }
            
            await Promise.all(thisModule.sources.map((source: BaseAudioGraphNodeModule) => source.init(options)));
            await Promise.all(thisModule.listeners.map((listener: any) => listener.init(options)));

            resolve();
        });
    }

    passThrough(source: any) {

        //unlike receive method, passthrough method patches the connection thru to the target's audionode, whereas receive, enqueues connections preparing for them to be made when its time
        //the goal here is to connect directly to the first AudioNode we find crawling upstream

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

        for(let d of this.listeners){
            d.passThrough(source);
        }

    }

    receive(source: any) {

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
            if(Object.keys(thisModule.audioEndpoints).length) {

                for(let input of inputEndpoints){

                    for(let key of Object.keys(thisModule.audioEndpoints)){
                        input.connect(thisModule.audioEndpoints[key]);
                    }
                }
                
            }
            else{

                
                for(let input of inputEndpoints){

                    const key = input.id || Object.keys(thisModule.audioEndpoints).length;
                    thisModule.audioEndpoints[key] = input;
                }
                
            }

            resolve();

        });
    }

    async connect() {

        const thisModule =  this;

        return new Promise(async (resolve)=>{
            

            // if(this.staticEndpoints){
            //     debugger
            // }

            
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

            // await Promise.all(thisModule.listeners.map((d: any) => d.receive(thisModule)));
            
            resolve();
        });
        
    }

    start(time: number, options?: any, autoReleaseDelayMs?: number) {

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

        if(this.operations.stop){
            this.operations.stop(options);
        }
        
        // stop sources
        for(let src of this.sources){
            src.stop(options);
        }

    }


    async trigger(options?: any | null) {
        //Only instrument module implements this...
        return await this.operations.trigger(options);
    }

    
    async resume() {

        this.context.resume();

    }

    async registerBinding(source: any) {
        await this.target.registerBinding(source);
    }

    async registerSource(source: any) {

        this.sources.push(source);

        if(source.binding){
            await this.target.registerBinding(source);
        }

    }

    async registerListener(aux: any) {

        this.listeners.push(aux);
        
    }

    getEndPoints() {
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