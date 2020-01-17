import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

declare var MediaRecorder: any | null; 

class RecorderModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoints.default = proxy.context.createMediaStreamDestination();

                let mediaRecorder:any = null;
                let recording = false;
                var chunks:any[] = [];

                params.buttonRef.current.addEventListener("click", function(e:any) {
                    
                    if (!recording) {
                        
                        //new instance of mediaRecorder
                        mediaRecorder = new MediaRecorder(proxy.audioEndpoints.default.stream);
                        
                        mediaRecorder.ondataavailable = function(e:any) {
                            chunks.push(e.data);
                        };
                    
                        mediaRecorder.onstop = function(e:any) {
                            var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                            params.audioRef.current.src = URL.createObjectURL(blob);
                        };

                        e.target.value = "Stop";
                        
                        mediaRecorder.start();

                        recording = true;
                      } else {
                        mediaRecorder.stop();
                        e.target.value = "Record";
                        recording = false;
                      }
                });
             
                

            }

        });

        this.$type = 'Recorder';
        
        proxy = this;

    }

   

}

export default RecorderModule;