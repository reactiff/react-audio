import React from 'react'

export default (children: any, props: any) => {
    return React.Children.map(children, (child: any) => {
        if(React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;
            const clone = React.cloneElement(element, props);
            return clone;
        }
    });
}
