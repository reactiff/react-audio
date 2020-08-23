export default {

    connection(source: any, endPointIndex:number, destination: string) {
        
        console.log(' ( ' + source.getDescription() + ':' + endPointIndex + ' ) --- to --> ( ' + destination + ' )');

    },

    initialization(entity: any, options: any) {
        console.log(' init ' + entity.getDescription(), options);
    },

    passThrough(entity: any, source: any) {
        console.log(' pass -- ' + source.getDescription() + ' -thru- ' + entity.getDescription() + ' -->');
    },

    receive(entity: any, source: any) {
        console.log(' (' + source.getDescription() + ') received by (' + entity.getDescription() + ')');
    },

    start(entity: any, time: number, options: any) {
        console.log(' start (' + entity.getDescription() + ') @ ' + time, options);
    },

    stop(entity: any, options: any) {
        console.log(' stop (' + entity.getDescription() + ')', options);
    },

    registerSource(entity: any, source: any) {
        console.log(' ' + entity.getDescription() + ' < ~ ' + source.getDescription(), entity.sources);
    },

    indentWrite(text: string, data: any) {
        console.log(' - ' + text, data);
    },

    write([...args]) {
        console.log(...args);
    }
}