import BaseAudioGraphNodeModule from './BaseAudioGraphNodeModule';

class ConstantModule extends BaseAudioGraphNodeModule {

    constructor(target: any, audioContext: any, params: any) {
             
        let proxy: any = null;

        super(target, audioContext, params, {

            init: (options?: any) => {

                return new Promise(resolve => {
                    proxy.ownEndpoints.default = proxy.context.createConstantSource();
                    const value = typeof params.offset !== 'undefined' ? params.offset : 1;
                    proxy.ownEndpoints.default.offset.value = value;    
                    resolve();
                });
                
            },

            start: (time: number, options?: any) => {
                proxy.ownEndpoints.default.start(time);
            }
           
        });

        this.$type = 'Constant';
        
        proxy = this;

    }

    getDescription() {
        return 'DC: ' + getSign(this.$params.value) + this.$params.offset.toFixed(1);
    }

    getShortDescription() {
        return this.getDescription();
    }

}

function getSign(value: number) {
    if (value>0) return '+';
    if (value<0) return '-';
    return '';
}

export default ConstantModule;