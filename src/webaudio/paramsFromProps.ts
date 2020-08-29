const excludedKeys: any = {
    children: true
}

export default (props:any, additionalProps?:any, defaults?: any) => {

    const params:any = {};

    for(let key in props){
        if(!excludedKeys[key]){
            params[key] = props[key];
        }
    }

    if(additionalProps){
        Object.assign(params, additionalProps);
    }

    if(defaults){
        for(let defaultKey in defaults){
            if(!params.hasOwnProperty(defaultKey)){
                params[defaultKey] = defaults[defaultKey];
            }
        }    
    }
    
    return params;

};