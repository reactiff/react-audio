export enum TransitionMethod {
    Linear,
    Exponential,
    Target
}

type applyTransitionPropsType = {
    method: TransitionMethod | string, 
    audioParam: AudioParam, 
    time: number,
    targetValue: number,
    delay?: number,
    duration?: number,
};

export const parseTransitionMethod = (method: TransitionMethod | string) => {

    if (!method) return TransitionMethod.Linear;
    if (typeof method !== 'string') return method;

    const key = method.toLowerCase();

    if ('target'.startsWith(key)) return TransitionMethod.Target;
    if ('exponential'.startsWith(key)) return TransitionMethod.Exponential;
    if ('linear'.startsWith(key)) return TransitionMethod.Linear;
    throw new Error('Invalid transition method ' + method);
}

export const applyTransition = (props: applyTransitionPropsType) => {

    const method = parseTransitionMethod(props.method);
    
    switch(method){

        case TransitionMethod.Target:

            props.audioParam.setTargetAtTime(
                props.targetValue, 
                props.time + (props.delay || 0),
                (props.duration || 0)
            );
        
            break;

        case TransitionMethod.Exponential:
            
            props.audioParam.exponentialRampToValueAtTime(
                props.targetValue, 
                props.time + (props.delay || 0) + (props.duration || 0)
            );
        
            break;

        default:
            
            props.audioParam.linearRampToValueAtTime(
                props.targetValue, 
                props.time + (props.delay || 0) + (props.duration || 0)
            );
            
            break;

    }
}

export default TransitionMethod;