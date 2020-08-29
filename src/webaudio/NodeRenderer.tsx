import _ from 'lodash';
import React from 'react';
import partitionChildren from './partitionChildren';
import parentContext from './Context/parentContext';
import './css/node.css'

export default (props: any) => {
    
    // two types of children, racked and inline. 
    const [inline, racked] = partitionChildren(props.children, (child:any) => child.props.inline);

    return (
        <parentContext.Provider value={props.proxy}>
            <div className={`ag-node ag-${props.proxy.$type.toLowerCase()}`} >
                {
                    racked.length > 0 &&
                    <div className="upstream flex column spaced align-stretch">
                        {racked}
                    </div>
                }
                <div className="node flex row spaced align-stretch">
                    {
                        props.title &&
                        <div>
                            {props.title}
                        </div>
                    }
                    {
                        props.icon &&
                        props.icon
                    }
                    <div className="grow relative">
                        {inline}
                    </div>
                </div>
            </div>  
        </parentContext.Provider>
    );
}
