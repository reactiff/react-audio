import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';
import { string } from 'prop-types';

class AnalyzerModule extends BaseAudioGraphNodeModule {

    uiInitialized: boolean;

    animating: boolean;
    dumped: boolean;
    

    bufferLength: number;


    constructor(target: any, audioContext: any, params: any) {

        let proxy: any = null;

        

        super(target, audioContext, params, {

            init: async () => {
                return new Promise((resolve)=>{
                    proxy.audioEndpoint = proxy.context.createAnalyser();
                    proxy.bufferLength = proxy.audioEndpoint.frequencyBinCount;

                    proxy.initDrawing();

                    resolve();
                })
            }

        });

        proxy = this;

        this.uiInitialized = false;

        this.bufferLength = 0;
        this.animating = true;
        this.dumped = false;

        this.$type = 'Analyzer';

        

        
        
    } //end constructor()

    initDrawing() {

        if(this.uiInitialized){
            return;
        }

        this.uiInitialized = true;

        const proxy = this;

        const w = proxy.$params.width;
        const h = proxy.$params.height;

        const timeAxisSize = proxy.$params.sizeX || w;
        const magAxisSize = proxy.$params.sizeY || h;

        let clearRect = {
            x: 0,
            y: 0,
            w: w,
            h: h
        };
        
        if(proxy.$params.onClick){
            proxy.$params.canvasRef.current.addEventListener('click', (e:any) => {
                proxy.$params.onClick(proxy)
                e.preventDefault();
                return false;
            } );
            
        }

        const ctx = proxy.$params.canvasRef.current.getContext('2d');

        //ctx.scale(2,2)
        // ctx.translate(0.5, 0.5);
        ctx.lineWidth = 2;

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#ffffff";

        if(proxy.$params.rotate90){
            ctx.translate(w/2, h/2);
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-timeAxisSize/2, -magAxisSize/2);

            clearRect.x = -(h-timeAxisSize);
            clearRect.y = -(w-magAxisSize);
            clearRect.w = h;
            clearRect.h = w + (w-magAxisSize);
        }

        ctx.clearRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
        
        if(proxy.$params.traces){
            ctx.fillStyle = "rgba(0,0,0,0.1)";
        }
        else{
            ctx.fillStyle = "rgba(0,0,0,1)";
        }
        
        let drawCount = 0;

        if(proxy.$params.type === 'wave'){

            const waveform = new Float32Array(proxy.bufferLength);
            //const waveform = new Uint8Array(bufferLength);

            const updateWaveform = () => {
                requestAnimationFrame(updateWaveform);
                //proxy.audioEndpoint.getByteTimeDomainData(waveform);
                proxy.audioEndpoint.getFloatTimeDomainData(waveform);
            }

            const drawWaveform = () => {

                requestAnimationFrame(drawWaveform);
                
                const getY = (value: number) => ((value + (proxy.$params.dcOffset || 0) ) * (proxy.$params.scale || 1) );

                if(!this.animating){

                    if(!this.dumped){

                        
                        let lines = [];

                        for(let i = 0; i < waveform.length; i++){

                            lines.push(getY(waveform[i]));
                        }
                        
                        console.clear();

                        console.log('\n' + lines.join('\n'));

                        this.dumped = true;

                    }
                    

                    return;
                }

                

                const xscale = (timeAxisSize / waveform.length);
                
                ctx.fillRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);

                // draw zero line
                ctx.strokeStyle = "rgba(0,255,0,0.5)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, magAxisSize/2);
                ctx.lineTo(timeAxisSize, magAxisSize/2);
                ctx.stroke();


                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;

                ctx.beginPath();
                for(let i = 0; i < waveform.length; i++) {

                    const x = i * xscale;
                    //const y = waveform[i] * h;

                    //from byte
                    const y = magAxisSize - (getY(waveform[i]) * magAxisSize + magAxisSize/2);
            
                    if(i == 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            
                ctx.stroke();
            }
            updateWaveform();
            drawWaveform();
        }
        else if(proxy.$params.type === 'bar'){

            proxy.audioEndpoint.fftSize = 1024;
            
            //var freqData = new Uint8Array(bufferLength);
            var freqData = new Float32Array(proxy.bufferLength);

            const updateFrequencyData = () => {
                requestAnimationFrame(updateFrequencyData);
                proxy.audioEndpoint.getFloatFrequencyData(freqData);
            }
            const drawBarGraph = () => {

                requestAnimationFrame(drawBarGraph);

                
                

                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, w, h);
                
                let minFreq = -1;
                let maxFreq = -1;

                //find min and max buckets
                for(let i = 0; i < proxy.bufferLength; i++) {
                    if(freqData[i]){
                        minFreq = i
                        break;
                    }
                }
                for(let i = proxy.bufferLength; i >= 0; i--) {
                    if(freqData[i]){
                        maxFreq = i + 1
                        break;
                    }
                }

                if(minFreq<0 || maxFreq<0){
                    return
                }

                const barCount = (maxFreq - minFreq);

                const colWidth = (w / (barCount));
                const colMargin = colWidth * 0;
                const barWidth = colWidth * 1;
                
                //console.clear();

                //let gotdata = false;

                for(let i = 0; i < proxy.audioEndpoint.fftSize / 2; i++) {

                    const barVal = freqData[i];
                    const barPct = freqData[i] / 255;
                    const barHeight = h * barPct;

                    // if(freqData[0]> -200){
                    //     gotdata=true;
                    // }

                    const color = Math.min(barVal, 255);

                    const x = colWidth * (i - minFreq) + colMargin;
                    const y = h - (barHeight);

                    ctx.fillStyle = 'rgb(0,'+color+','+color+')';
                    ctx.fillRect(x, y, barWidth, barHeight);
            
                    // if(gotdata){
                    //     console.log(freqData[i]);
                    // }
                    
                    
                }

                // if(gotdata){
                //      debugger;
                // }
                
            }
            
            updateFrequencyData();
            drawBarGraph();
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