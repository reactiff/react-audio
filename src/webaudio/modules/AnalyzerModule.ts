import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import Log from './Log';
import WaveGraph from './analyzergraphs/WaveGraph'
import BarGraph from './analyzergraphs/BarGraph'
import ScatterGraph from './analyzergraphs/ScatterGraph'

class AnalyzerModule extends BaseAudioGraphNodeModule {

    uiInitialized: boolean;
    animating: boolean;
    dumped: boolean;
    analyzers: any;

    animationRequestId: number;

    constructor(target: any, audioContext: any, params: any) {

        let proxy: any = null;

        super(target, audioContext, params, {

            //Analyzer
            init: (options?: any | null) => {
                return new Promise((resolve)=>{

                    //todo create two analyzers for scatter type
                    proxy.ownEndpoints['default'] = proxy.context.createAnalyser();

                    if(params.type==='scatter'){
                        proxy.ownEndpoints['secondary'] = proxy.context.createAnalyser();
                        proxy.analyzers = {
                            x: proxy.ownEndpoints['default'],
                            y: proxy.ownEndpoints['secondary']
                        }
                    }

                    proxy.initDrawing();

                    resolve();
                })
            }
        });

        this.animationRequestId = 0;

        this.uiInitialized = false;
        this.analyzers = {};
        this.animating = true;
        this.dumped = false;

        this.$type = 'Analyzer';

        proxy = this;

    } //end constructor()

    //override receive
    receive(source: any) {
        
        const thisModule =  this;

        return new Promise(async (resolve) => {

            if (thisModule.inputSources.hasOwnProperty(source.id)) {

                // make sure that the source doesn't have any new endpoints
                debugger;

                resolve();
                return;
            }

            if(thisModule.$params.type==='scatter'){
                
                //two inputs

                for(let i of Object.values(source.inputSources)){

                    const input = (i as BaseAudioGraphNodeModule);
                    
                    if(input.$params.id === thisModule.$params.x || input.$params.id === thisModule.$params.y){

                        const inputEndpoints = input.getEndPoints();

                        const id = input.$params.id;
        
                        let boundEndpoint;
                        if(id === thisModule.$params.x){
                            boundEndpoint = thisModule.analyzers.x;
                        }
                        else if(id === thisModule.$params.y){
                            boundEndpoint = thisModule.analyzers.y;
                        }
        
                        let cnt=0;
                        for(let ep of inputEndpoints){
                            Log.write(' connect ' + source + '.' + cnt + ' -- to --> ' + thisModule.getDescription());
                            ep.connect(boundEndpoint);
                            cnt++;
                        }

                    }
                }
            }
            else{
                const inputEndpoints = source.getEndPoints();
                let cnt=0;
                for(let inputSignal of inputEndpoints){
                    Log.write(' connect ' + source + '.' + cnt + ' -- to --> ' + thisModule.getDescription());
                    inputSignal.connect(thisModule.ownEndpoints.default);
                }
            }

            resolve();
        });
    }

    initDrawing() {
        if(this.$params.type === 'wave'){
            WaveGraph.init(this);
        }
        else if(this.$params.type === 'bar'){
            BarGraph.init(this);
        }
        else if(this.$params.type === 'scatter'){
            ScatterGraph.init(this);
        }
    }

    toggleAnimation() {
        this.animating = !this.animating;
        if(!this.animating){
            this.dumped = false;
        }
    }

}

export default AnalyzerModule;