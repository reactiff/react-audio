import React from 'react';

import './css/audionode.css'

type PropsType = {
    children: any
}
  
export default (props: PropsType) => {

    return (

        <div className="audio-node">

            {
                typeof props.children === 'undefined' ?
                <h1>Audio Node</h1> :
                props.children
            }
            
            
        </div>

    )
}