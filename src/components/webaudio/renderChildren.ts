import React from 'react'

//renderChildren
export default (children: any, props: any) => {
    return React.Children.map(children, (child) => {
        if(React.isValidElement(child)) {
            return React.cloneElement(
                child as React.ReactElement<any>, props
            );
        }
    });
}
