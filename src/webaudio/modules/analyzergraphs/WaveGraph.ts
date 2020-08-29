
const createStats = () => ({ min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, range: 2, power: 0 });

export default {

    init(proxy: any) {

        const analyzerEndPoint = proxy.ownEndpoints.default
        const waveform = new Float32Array(analyzerEndPoint.fftSize);

        const w = analyzerEndPoint.fftSize; //proxy.$params.width;
        const h = proxy.$params.height;

        const stats = { 
            total: createStats(),
            previous: createStats(),
            current: createStats(),
        }
        
        const timeAxisSize = proxy.$params.sizeX || w;
        const magAxisSize = proxy.$params.sizeY || h;

        let zeroLine = h / 2;
        let clearRect = { x: 0, y: 0, w: w, h: h };
        let clearStyle = "";
        
        const ctx = proxy.$params.canvasRef.current.getContext('2d');
    
        ctx.lineWidth = 10;
    
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = proxy.$params.color || 'white';
    
        if(proxy.$params.rotate90) {

            ctx.translate(w/2, h/2);
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-timeAxisSize/2, -magAxisSize/2);
    
            clearRect.x = -(h-timeAxisSize);
            clearRect.y = -(w-magAxisSize);
            clearRect.w = h;
            clearRect.h = w + (w-magAxisSize);
    
            zeroLine = magAxisSize / 2
            
        }
    
        ctx.font = '8px sans serif';
                
        if(proxy.$params.traces){
            clearStyle = "rgba(0,0,0,0.5)";
        }
        else{
            clearStyle = "rgba(0,0,0,1)";
        }
        
        ctx.clearRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
            
        const drawWaveform = () => {
    
            analyzerEndPoint.getFloatTimeDomainData(waveform);

            const currentValue = waveform[waveform.length-1];
                        
            const magRange = Math.max(stats.total.range * 1.25, 2);
            const magScale = 2 / magRange;
            
            const getY = (value: number) => ((value + (proxy.$params.dcOffset || 0) ) * (proxy.$params.scale || 1) * magScale );

            const xscale = (timeAxisSize / waveform.length);
            
            const marginSize = magAxisSize * 0.1;
            const magAxisWithoutMargins = magAxisSize - marginSize * 2;

            const mapValue = (value: number) => {

                const min = Math.min(stats.current.min, stats.total.min);
                const max = Math.max(stats.current.max, stats.total.max);
                const range = max - min;
                
                const relative = (value - min) / range;

                const y = magAxisSize - (relative * magAxisWithoutMargins + marginSize);

                return y;

            };

            ctx.fillStyle = clearStyle;
            ctx.fillRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
    
            // draw zero line
            // ctx.strokeStyle = "rgba(0,255,0,0.1)";
            // ctx.lineWidth = 1;
            // ctx.beginPath();
            // ctx.moveTo(0, zeroLine);
            // ctx.lineTo(timeAxisSize, zeroLine);
            // ctx.stroke();
    
            // draw wave
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();

            // stats
            stats.current = createStats();

            for(let i = 0; i < waveform.length; i++) {
    
                const x = i * xscale;
    
                const value = waveform[i];

                // set color opacity based on power
                stats.current.min = Math.min(stats.current.min, value);
                stats.current.max = Math.max(stats.current.max, value);
                stats.current.range = stats.current.max - stats.current.min;

                const power = Math.round(stats.current.range / 1.2 * 10);
                if (power !== stats.current.power) {
                    stats.current.power = power;
                    const alpha = Math.min(power / 10 + 0.2, 1);
                    const r = Math.round(255 * alpha);
                    const g = 255; //Math.round(255 * alpha);
                    const b = Math.round(255 * alpha);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                }
                
                
                const y = mapValue(value);
        
                if(i == 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // stats to previous
            stats.previous.min = Math.min(stats.current.min, stats.previous.min);
            stats.previous.max = Math.max(stats.current.max, stats.previous.max);
            stats.previous.range = stats.current.range;
            stats.previous.power = stats.current.power;

            // stats to total
            stats.total.min = Math.min(stats.current.min, stats.total.min);
            stats.total.max = Math.max(stats.current.max, stats.total.max);
            stats.total.range = stats.total.max - stats.total.min;
            stats.total.power = Math.round(stats.total.range / 2 * 10);

            // darken label background
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(clearRect.x, clearRect.y, 20, clearRect.h);

            // draw magnitude labels
            ctx.fillStyle = 'white';
            ctx.fillText(stats.total.max.toFixed(1).padStart(5, ' '), 0, mapValue(stats.total.max) + 4);
            ctx.fillText(stats.total.min.toFixed(1).padStart(5, ' '), 0, mapValue(stats.total.min) + 2);

            proxy.animationRequestId = requestAnimationFrame(drawWaveform);

        }
    
        if (proxy.animationRequestId) {
            cancelAnimationFrame(proxy.animationRequestId);
        }
        
        drawWaveform();
    
    }
}

