import React, { ReactElement } from 'react';

import renderChildren from './renderChildren'
  
import './css/analyzer.css'

type AnalyzerType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,
    registerAudioNode?: {(source: any): void},

    //specific
    type: any
}

export default (props: AnalyzerType) => {

    console.log('Render <Analyzer>');
        
    let children = null;
    let canvas: ReactElement | null = null;

    if(props.context){
    
        const canvasRef: any = React.createRef();
        canvas = (<canvas ref={canvasRef} className="analyzer" width="800" height="200"></canvas>)

        let analyzer: AnalyserNode | null = null; 

        // let waveform: Float32Array | null = null;
         
        


        const analyzerNode = {

            init: async () => {
                return new Promise((resolve)=>{

                    analyzer = props.context!.createAnalyser();
                    
                    const bufferLength = analyzer.frequencyBinCount;
                    
                    const w = 800;
                    const h = 200;

                    canvasRef.current.width = w;
                    canvasRef.current.height = h;
                    
                    let ctx = canvasRef.current.getContext('2d');
                    ctx.translate(0.5, 0.5);
                    //ctx.scale(0.5,0.5);
                    ctx.lineWidth = 6;

                    ctx.fillStyle = "#000000";
                    ctx.strokeStyle = "#ffffff";

                    let drawCount = 0;

                    if(props.type === 'wave'){
                        const waveform = new Float32Array(bufferLength);
                        const updateWaveform = () => {
                            requestAnimationFrame(updateWaveform);
                            analyzer!.getFloatTimeDomainData(waveform);
                        }
                        const drawWaveform = () => {

                            requestAnimationFrame(drawWaveform);
                            
                            

                            const xscale = (w / waveform.length);
                            
                            ctx.fillRect(0, 0, w, h);
                            ctx.beginPath();

                            for(let i = 0; i < waveform.length; i++) {

                                const x = i * xscale;
                                const y = ( 0.5 + (waveform[i] / 2) ) * h;
                        
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
                    else if(props.type === 'bar'){

                        analyzer.fftSize = 64;
                        
                        var freqData = new Uint8Array(bufferLength);

                        const updateFrequencyData = () => {
                            requestAnimationFrame(updateFrequencyData);
                            analyzer!.getByteFrequencyData(freqData);
                        }
                        const drawBarGraph = () => {

                            requestAnimationFrame(drawBarGraph);

                            
                            

                            ctx.fillStyle = "#000000";
                            ctx.fillRect(0, 0, w, h);
                            
                            let minFreq = -1;
                            let maxFreq = -1;

                            //find min and max buckets
                            for(let i = 0; i < bufferLength; i++) {
                                if(freqData[i]){
                                    minFreq = i
                                    break;
                                }
                            }
                            for(let i = bufferLength; i >= 0; i--) {
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
                            
                            

                            for(let i = minFreq; i < maxFreq; i++) {

                                const barVal = freqData[i];
                                const barPct = freqData[i] / 255;
                                const barHeight = h * barPct;

                                const color = Math.min(barVal, 255);

                                const x = colWidth * (i - minFreq) + colMargin;
                                const y = h - (barHeight);

                                ctx.fillStyle = 'rgb(0,'+color+','+color+')';
                                ctx.fillRect(x, y, barWidth, barHeight);
                        
                                
                            }
                            
                        }
                        
                        updateFrequencyData();
                        drawBarGraph();
                    }
                    

                    resolve();
                })
            },
            receive: (source: any) => {
                source.connect(analyzer);
                //patch thru
                props.target.receive(source)
            },
            connect: async () => {
                return new Promise((resolve)=>{
                    resolve();
                })
            },
            trigger: async (time: number) => {
                // analyzer can't be triggered
            }
        }
        
        props.registerAudioNode!(analyzerNode);

        children = renderChildren(props.children, {
            context: props.context,
            target: analyzerNode,
            registerAudioNode: props.registerAudioNode
        })

    }
    
    return (
        <div className="analyzer">
            
            {children}

            {canvas}

        </div>
    );
}