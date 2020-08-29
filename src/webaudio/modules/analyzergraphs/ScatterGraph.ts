export default {
    init(proxy: any) {
        
        const w = proxy.$params.width;
        const h = proxy.$params.height;
        
        let clearRect = { x: 0, y: 0, w: w, h: h };
        let clearStyle = "";
        
        const ctx = proxy.$params.canvasRef.current.getContext('2d');

        ctx.lineWidth = 1;

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = proxy.$params.color || 'white';
        ctx.clearRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);
                
        if(proxy.$params.traces){
            clearStyle = "rgba(0,0,0,0.15)";
        }
        else{
            clearStyle = "rgba(0,0,0,1)";
        }
        
        ctx.fillStyle = clearStyle;

        ///

        const xwave = new Float32Array(proxy.analyzers.x.frequencyBinCount);
        const ywave = new Float32Array(proxy.analyzers.y.frequencyBinCount);
        
        ctx.font = "18px Arial";
        let axis = {
            x: { min: Infinity, max: -Infinity },
            y: { min: Infinity, max: -Infinity }
        }


        const endpointX = proxy.analyzers.x;
        const endpointY = proxy.analyzers.y;

        const drawWaveform = () => {

            endpointX.getFloatTimeDomainData(xwave);
            endpointY.getFloatTimeDomainData(ywave);
            
            ctx.fillStyle = clearStyle;
            ctx.fillRect(clearRect.x, clearRect.y, clearRect.w, clearRect.h);

            // draw axis lines
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;

            // x
            ctx.beginPath();
            ctx.moveTo(0, h/2);
            ctx.lineTo(w, h/2);
            ctx.stroke();

            // y
            ctx.beginPath();
            ctx.moveTo(w/2, 0);
            ctx.lineTo(w/2, h);
            ctx.stroke();

            ctx.fillStyle = 'white';

            // draw axis values
            if(axis.x.min>-Infinity){
                ctx.textAlign = 'left';
                ctx.fillText(axis.x.min.toFixed(2), 7, h/2+5);
            }
            if(axis.x.max<Infinity){
                ctx.textAlign = 'right';
                ctx.fillText(axis.x.max.toFixed(2), h - 4, h/2+5);
            }
            if(axis.y.min>-Infinity){
                ctx.textAlign = 'center';
                ctx.fillText(axis.y.min.toFixed(2), w/2, 19);
            }
            if(axis.y.max<Infinity){
                ctx.textAlign = 'center';
                ctx.fillText(axis.y.max.toFixed(2), w/2, h - 7);
            }
            

            ctx.fillStyle = proxy.$params.color || 'white';
                    
            const x = xwave[0] * w/3 + w/2;
            const y = ywave[0] * h/3 + h/2;

            ctx.fillRect(x-2, y-2, 5, 5);

            if(xwave[0] < axis.x.min){
                axis.x.min = xwave[0];
            }
            if(xwave[0] > axis.x.max){
                axis.x.max = xwave[0];
            }

            if(ywave[0] < axis.y.min){
                axis.y.min = ywave[0];
            }
            if(ywave[0] > axis.y.max){
                axis.y.max = ywave[0];
            }

            requestAnimationFrame(drawWaveform);

        }

        drawWaveform();
    }
}