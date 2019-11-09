import React from 'react'
// import IReactAudioComponentProps from './types/IReactAudioComponentProps'

//renderChildren
export default (children: any, props: any) => {

    return React.Children.map(children, (child) => {
        
        if(React.isValidElement(child))
        {
            return React.cloneElement(
                child as React.ReactElement<any>, props
            );
        }
        else{
            console.log('Not a valid element');
        }
        
        
    });
}
