import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class SliderModule extends BaseAudioGraphNodeModule {

    uiInitialized: boolean;
    uiModule: boolean;

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;
        
        super(target, audioContext, params, {

            init: () => {

                if(proxy.uiInitialized){
                    return;
                }
        
                proxy.uiInitialized = true;
                
                proxy.targetParam = proxy.target.getAudioParam(params.targetParam);
                if(!proxy.targetParam){
                    throw new Error(proxy.getDescription() + ' does not have a property named ' + params.targetParam);
                }

                params.inputRef.current.addEventListener('input', (e:any) => {

                    const currentValue = e.target.valueAsNumber;
                    const targetParams = proxy.target.getAudioParam(params.targetParam);

                    targetParams.forEach((p:any) => {
                        p.setTargetAtTime(currentValue, audioContext.currentTime, 0)
                    });

                    params.setCurrentValue(currentValue);

                    e.preventDefault();
                    
                    return false;

                });
            

            },
            
            start: (time:number) => {
                
                const currentValue = params.inputRef.current.valueAsNumber;

                const targetParams = proxy.target.getAudioParam(params.targetParam);
                targetParams.forEach((p:any) => {
                    p.setTargetAtTime(currentValue, audioContext.currentTime, 0)
                });
                
                
            }
            
           
        });

        this.$type = 'Slider';
        
        this.uiInitialized = false;
        this.uiModule = true;

        proxy = this;

    }
}

export default SliderModule;