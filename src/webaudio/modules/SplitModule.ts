import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

export class SplitInputModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            connect: () => {

                return new Promise(async (resolve)=>{
                    
                    const inputs = proxy.getEndPoints();

                    const entryNodes: any[] = []
                    
                    for(let rn of proxy.target.returnNodes){
                        entryNodes.push(...rn.getEntryNodes())
                    }

                    if(entryNodes.length){
                        for(let entry of entryNodes){
                            for(let input of inputs){
                                entry.receive(input);
                            }
                        }
                    }
                    else{
                        proxy.target.receive(proxy);
                    }
                
                    resolve();
                });
                
            }

        });

        this.$type = 'SplitInput';
        
        proxy = this;

    }
}


export class SplitReturnModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            
        });

        this.$type = 'SplitReturn';
        
        proxy = this;

    }

    getEntryNodes(){

        const entries:any[] = [];

        const test = (node: any) => {
            return node.sources.length===0 && node.isInput;
        }
        const select = (node: any) => {
            entries.push(node)
        }

        this.traverseSources(test, select);

        return entries;
    }
}


class SplitModule extends BaseAudioGraphNodeModule {

    inputNode: SplitInputModule | null;
    returnNodes: SplitReturnModule[];

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            // connect: () => {
            //     proxy.inputNode.connect();
            //     proxy.returnNode.connect();
            // },
            // start: (time: number) => {
            //     proxy.returnNode.start();
            //     proxy.inputNode.start();
            // }
        });

        this.$type = 'Split';
        this.inputNode = null;
        this.returnNodes = [];

        proxy = this;

    }

    registerInputNode(inputNode: SplitInputModule) {
        this.inputNode = inputNode;
    }

    registerReturnNode(returnNode: SplitReturnModule) {
        this.returnNodes.push(returnNode);
    }
    
}

export default SplitModule;