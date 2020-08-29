const LOGGING_ENABLED = false;

export default {
    
    connection(source: any, endPointIndex:number, destination: string) {
        if (LOGGING_ENABLED) console.log(' ( ' + source.getDescription() + ':' + endPointIndex + ' ) --- to --> ( ' + destination + ' )');
    },

    initialization(entity: any, options: any) {
        if (LOGGING_ENABLED) console.log(' init ' + entity.getDescription(), options);
    },

    passThrough(entity: any, source: any) {
        if (LOGGING_ENABLED) console.log(' pass -- ' + source.getDescription() + ' -thru- ' + entity.getDescription() + ' -->');
    },

    receive(entity: any, source: any) {
        if (LOGGING_ENABLED) console.log(' connected (' + source.getDescription() + ') -- to --> (' + entity.getDescription() + ')');
    },

    start(entity: any, time: number, options: any) {
        if (LOGGING_ENABLED) console.log(' start (' + entity.getDescription() + ') @ ' + time, options);
    },

    stop(entity: any, options: any) {
        if (LOGGING_ENABLED) console.log(' stop (' + entity.getDescription() + ')', options);
    },

    registerSource(entity: any, source: any) {
        if (LOGGING_ENABLED) console.log(' ' + entity.getDescription() + ' < ~ ' + source.getDescription(), entity.sources);
    },

    indentWrite(text: string, data: any) {
        if (LOGGING_ENABLED) console.log(' - ' + text, data);
    },

    write(text: string) {
        if (LOGGING_ENABLED) console.log(text);
    },

    clear() {
        if (LOGGING_ENABLED) console.clear();
    }
}