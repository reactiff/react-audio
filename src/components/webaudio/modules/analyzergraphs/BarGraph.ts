export default {
    init(proxy: any) {
        
        const w = proxy.$params.width;
        const h = proxy.$params.height;

        const timeAxisSize = proxy.$params.sizeX || w;
        const magAxisSize = proxy.$params.sizeY || h;
        
        let magAxisZero = h / 2;

        let clearRect = { x: 0, y: 0, w: w, h: h };
        let clearStyle = "";

        const analyzerEndPoint = proxy.audioEndpoints.default

        const waveform = new Float32Array(analyzerEndPoint.frequencyBinCount);
        
        const ctx = proxy.$params.canvasRef.current.getContext('2d');

        ctx.lineWidth = 1;

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = proxy.$params.color || 'white';

        if(proxy.$params.rotate90){
            ctx.translate(w/2, h/2);
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-timeAxisSize/2, -magAxisSize/2);

            clearRect.x = -(h-timeAxisSize);
            clearRect.y = -(w-magAxisSize);
            clearRect.w = h;
            clearRect.h = w + (w-magAxisSize);

            magAxisZero = magAxisSize / 2
        }

        ctx.clearRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
                
        if(proxy.$params.traces){
            clearStyle = "rgba(0,0,0,0.15)";
        }
        else{
            clearStyle = "rgba(0,0,0,1)";
        }
        
        ctx.fillStyle = clearStyle;

        let drawCount = 0;

        analyzerEndPoint.fftSize = 128;
        
        var freqData = new Uint8Array(analyzerEndPoint.frequencyBinCount);
        
        const updateFrequencyData = () => {
            requestAnimationFrame(updateFrequencyData);
            analyzerEndPoint.getByteFrequencyData(freqData);
        }
        const drawBarGraph = () => {

            requestAnimationFrame(drawBarGraph);

            ctx.fillStyle = clearStyle;
            ctx.fillRect(0, 0, w, h);
            
            let minFreq = -1;
            let maxFreq = -1;

            //find min and max buckets
            for(let i = 0; i < analyzerEndPoint.frequencyBinCount; i++) {
                if(freqData[i]){
                    minFreq = i
                    break;
                }
            }
            for(let i = analyzerEndPoint.frequencyBinCount; i >= 0; i--) {
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

            for(let i = 0; i < analyzerEndPoint.fftSize / 2; i++) {

                const barVal = freqData[i];
                const barPct = freqData[i] / 255;
                const barHeight = h * barPct;

                // if(freqData[0]> -200){
                //     gotdata=true;
                // }

                if(barVal>220){
                    ctx.fillStyle = 'rgb('+Math.min(barVal, 255)*0.8  +',0,0)';
                }
                else{
                    ctx.fillStyle = 'rgb(0,'+Math.min(barVal, 255)+',0)';
                }

                const x = colWidth * (i - minFreq) + colMargin;
                const y = h - (barHeight);

                
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