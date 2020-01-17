import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

export class FeedbackReturnModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {
            
        });

        this.$type = 'FeedbackReturn';
        
        proxy = this;

    }

}


class FeedbackModule extends BaseAudioGraphNodeModule {

    returnNodes: FeedbackReturnModule[];

    constructor(target: any, audioContext: any, params: { [key:string] : {value: any}}) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            connect: () => {

                //feed forward as usual
                proxy.target.receive(proxy);

                //and also, feed back into the sources of all return nodes
                for(let rn of proxy.returnNodes){
                    
                    rn.passThrough(proxy);

                    // for(let src of rn.sources){
                    //     src.receive(proxy);
                    // }
                }

                // const inputs = proxy.getEndPoints();

                // const entryNodes = proxy.target.returnNode.getEntryNodes();

                // if(entryNodes.length){
                //     for(let entry of entryNodes){
                //         for(let input of inputs){
                //             entry.receive(input);
                //         }
                //     }
                // }
                // else{
                //     proxy.target.receive(proxy);
                // }

                
                
            }
        });

        this.$type = 'Feedback';
        this.returnNodes = [];

        proxy = this;

    }

    registerReturnNode(returnNode: FeedbackReturnModule) {
        const parent = this.findParent('Feedback', returnNode.$params.for);

        if(!parent){
            throw new Error('Feedback origin not found');
        }

        parent.returnNodes.push(returnNode);
    }
    
}

export default FeedbackModule;