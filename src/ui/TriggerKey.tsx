import React from 'react';

//import './css/gain.css'

// type TriggerKeyPropsType = {

//     //component specific
//     keyCode?: number,
//     targetValue?: number,
//     duration?: number,

//     delay?: number
// }

// export default (props: TriggerKeyPropsType) => {

//     let children = null;

//     if(props.context){
        
//         const proxy = new AudioGraphGainModule(
//             props.target,
//             props.context,
//             paramsFromProps(props)
//         );

//         props.target.registerSource(proxy);
        
//         children = renderChildren(props.children, {
//             context: props.context,
//             target: proxy
//         })   

//     }
    
//     return (
//         <div className="gain">
//             {children}
//         </div>
//     );
// }