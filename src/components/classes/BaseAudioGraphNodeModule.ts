class BaseAudioGraphNodeModule {
    
    $type: string = 'BaseAudioGraphNodeModule';
    $params: any;
    
    audioEndpoint: any;
    target: any;
    context: any;
    
    operations: any;

    sources: any[] = [];
    listeners: any[] = [];

    inputEndpoints: any[] = [];

    

    constructor(
        target: any, 
        audioContext: any, 
        params: any, 
        // callbacks: any, 
        operations: any) 
    {
        this.target = target;
        this.context = audioContext;
        this.$params = params;
        this.operations = operations;
    }

    // async resumeContext() {
    //     this.context.resume();
    // }

    getAudioParam(name: string) {
        return this.audioEndpoint[name];
    }

    getDescription() {
        return this.$type;
    }

    async init() {

        const thisModule =  this;

        // this.sources = [];
        // this.otherDestinations = [];

        this.inputEndpoints = [];

        return new Promise(async (resolve) => {

            if(thisModule.operations.init){
                thisModule.operations.init();
            }
            
            await Promise.all(thisModule.sources.map((source: BaseAudioGraphNodeModule) => source.init()));
            await Promise.all(thisModule.listeners.map((listener: any) => listener.init()));

            resolve();
        });
    }

    receive(source: any) {

        const thisModule =  this;

        return new Promise(async (resolve) => {

            let incoming;
            let sourceDescriptor;

            if(source instanceof AudioNode){
                sourceDescriptor = 'AudioNode';
                incoming = [source];
            }
            else{
                sourceDescriptor = source.getDescription();
                incoming = source.getEndPoints();
            } 

            if(thisModule.audioEndpoint){
               
                let cnt = 0;
                for(let ep of incoming){
                    ep.connect(thisModule.audioEndpoint);

                    if(incoming.length > 1){
                        console.log('(connected) --- ' + sourceDescriptor + ' [' + cnt + '] --- to ---> ' + thisModule.getDescription())
                    }
                    else{
                        console.log('(connected) --- ' + sourceDescriptor + ' --- to ---> ' + thisModule.getDescription())
                    }

                    cnt++;
                }
                
            }
            else{
                thisModule.inputEndpoints = thisModule.inputEndpoints.concat(incoming);

                if(incoming.length > 1){
                    console.log('(connected) --- ' + sourceDescriptor + ' (' + incoming.length + ') --- thru ---> ' + thisModule.getDescription())
                }
                else{
                    console.log('(connected) --- ' + sourceDescriptor + ' --- thru ---> ' + thisModule.getDescription())
                }
                

            }

            resolve();

        });
    }

    async connect() {

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

            // await Promise.all(thisModule.listeners.map((d: any) => d.receive(thisModule)));
            
            resolve();
        });
        
    }

    start(time: number) {

        if(this.operations.start){
            this.operations.start(time);
        }
        
        // start sources
        for(let src of this.sources){
            src.start(time);
        }

    }

    async trigger() {

        //init all

        await this.init();
        await this.connect();
                        
        //await Promise.all(this.sources.map((source: BaseAudioGraphNodeModule) => source.trigger(time)));

        const time = this.context.currentTime;

        // for(let src of this.sources){
        //     src.start(time);
        // }

        this.start(time);

    }

    async registerSource(source: any) {

        this.sources.push(source);

    }

    async registerListener(aux: any) {

        this.listeners.push(aux);
        
    }

    getEndPoints() {
        if(this.audioEndpoint){
            return [this.audioEndpoint];
        }
        else{
            return this.inputEndpoints;
        }
    }

    traverseSources(test: {(node:any): boolean}, select:{(node:any): void}){

        for(let src of this.sources){
        
            if(test(src)){
                select(src);
            }

            src.traverseSources(test, select);
        
        }

    }
}

export default BaseAudioGraphNodeModule;