export default (base: any, overrides: any) => {

    const result: { [index: string]: any } = base;
    
    for (let key in overrides) {
        const override = overrides[key];
        if (typeof override === 'object') {
            // copy present props without overwriting the base prop
            if (result[key]) {
                Object.assign(result[key], override);
            }
            else {
                result[key] = override;
            }
        }
        else {
            result[key] = override;
        }
    }
    
    return result;

};