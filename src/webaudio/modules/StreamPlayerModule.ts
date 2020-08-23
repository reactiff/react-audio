import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class StreamPlayerModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: async () => {
                return new Promise(async resolve => {
                                    
                    let supported = navigator.mediaDevices.getSupportedConstraints();

                    const constraint = { audio: { deviceId: params.deviceId, echoCancellation: false } };
                    const stream = await navigator.mediaDevices.getUserMedia(constraint)
                    .catch(err => {
                        throw new Error('The following getUserMedia error occured: ' + err);
                    });;

                    proxy.audioEndpoints.default = proxy.context.createMediaStreamSource(stream);

                    resolve();
                    
                });

            }
        });

        this.staticEndpoints = true;
        this.$type = 'StreamPlayer';
        proxy = this;
    }
}

export default StreamPlayerModule;