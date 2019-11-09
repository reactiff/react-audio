import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class AudioSourceModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: () => {
                
                proxy.audioEndpoint = proxy.context.createMediaElementSource(params.elementRef.current);

                params.elementRef.current.addEventListener('play', (e:any) => {
                    console.log(' :: (event) : playback started : ' + proxy.getDescription());
                });

                console.log(proxy.getDescription() + ' initialized');
                
            },

            start: async (time: number) => {
                console.log(' (start) @' + time + ' : ' + proxy.getDescription());
                proxy.audioEndpoint.mediaElement.play();                
            }

        });

        this.$type = 'AudioSource';
        
        proxy = this;

    }
}

export default AudioSourceModule;