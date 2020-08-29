import React from 'react';
import SplitModule from './modules/SplitModule';
import paramsFromProps from './paramsFromProps'

import audioContext from './Context/audioContext';
import parentContext from './Context/parentContext';

type SplitPropsType = {
    children?: any,
    value?: number,
    endValue?: number,
    duration?: number
}

const Split = (props: SplitPropsType) => {

    const context = React.useContext(audioContext);
    const target = React.useContext(parentContext);

    const [proxy] = React.useState(new SplitModule(
        target,
        context,
        paramsFromProps(props)
    ));

    target.registerSource(proxy);
        
    return (
        <div className="split">
            {props.children}
        </div>
    );
}
export default Split;