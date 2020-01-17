import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

import WaveGraph from './analyzergraphs/WaveGraph'
import BarGraph from './analyzergraphs/BarGraph'
import ScatterGraph from './analyzergraphs/ScatterGraph'

class AnalyzerModule extends BaseAudioGraphNodeModule {

    uiInitialized: boolean;
    animating: boolean;
    dumped: boolean;
    analyzers: any;

    constructor(target: any, audioContext: any, params: any) {

        let proxy: any = null;

        super(target, audioContext, params, {

            //Analyzer
            init: async () => {
                return new Promise((resolve)=>{

                    //todo create two analyzers for scatter type
                    proxy.audioEndpoints['default'] = proxy.context.createAnalyser();

                    if(params.type==='scatter'){
                        proxy.audioEndpoints['secondary'] = proxy.context.createAnalyser();
                        proxy.analyzers = {
                            x: proxy.audioEndpoints['default'],
                            y: proxy.audioEndpoints['secondary']
                        }
                    }

                    proxy.initDrawing();

                    resolve();
                })
            }
        });

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

            if(thisModule.$params.type==='scatter'){
                
                //two inputs

                for(let input of source.inputSources){

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
        
                        for(let ep of inputEndpoints){
                            ep.connect(boundEndpoint);
                        }

                    }
                }
            }
            else{
                const inputEndpoints = source.getEndPoints();
                for(let input of inputEndpoints){
                    input.connect(thisModule.audioEndpoints.default);
                }
            }

            resolve();
        });
    }


    initDrawing() {

        //do it once
        if(this.uiInitialized) { return; }
        this.uiInitialized = true;
        
        if(this.$params.onClick){
            this.$params.canvasRef.current.addEventListener('click', (e:any) => {
                this.$params.onClick(this)
                e.preventDefault();
                return false;
            } );
        }

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