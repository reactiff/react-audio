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
    
        // animation methods
        const updateWaveform = () => {
            requestAnimationFrame(updateWaveform);
            analyzerEndPoint.getFloatTimeDomainData(waveform);
        }
    
        const drawWaveform = () => {
    
            requestAnimationFrame(drawWaveform);
            
            const getY = (value: number) => ((value + (proxy.$params.dcOffset || 0) ) * (proxy.$params.scale || 1) );
    
            if(!proxy.animating){
    
                if(!proxy.dumped){
    
                    
                    let lines = [];
    
                    for(let i = 0; i < waveform.length; i++){
    
                        lines.push(getY(waveform[i]));
                    }
                    
                    // console.clear();
    
                    // console.log('\n' + lines.join('\n'));
    
                    proxy.dumped = true;
    
                }
                
    
                return;
            }
    
            
    
            const xscale = (timeAxisSize / waveform.length);
            
            ctx.fillRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
    
            // draw zero line
            ctx.strokeStyle = "rgba(0,255,0,0.5)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, magAxisZero);
            ctx.lineTo(timeAxisSize, magAxisZero);
            ctx.stroke();
    
    
            ctx.strokeStyle = proxy.$params.color || 'white';
            ctx.lineWidth = 2;
    
            ctx.beginPath();
            for(let i = 0; i < waveform.length; i++) {
    
                const x = i * xscale;
    
                const value = waveform[i];
                const transformed = getY(value) * magAxisSize / 2
                const atzero = magAxisZero - transformed;
                
                const y = atzero;
        
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
}

