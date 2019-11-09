const standardKeys: any = {
    context: true,
    target: true,
    children: true
}

export default (props:any, additionalProps?:any) => {

    const params:any = {};

    for(let key in props){
        if(!standardKeys[key]){
            params[key] = props[key];
        }
        
    }

    if(additionalProps){
        Object.assign(params, additionalProps);
    }
    
    return params;

};