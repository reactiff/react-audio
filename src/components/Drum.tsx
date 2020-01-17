import React from 'react';

import Instrument from './webaudio/Instrument'
import renderChildren from './webaudio/renderChildren'

import './css/instrument.css'

export default (props: any) => {

    return (

        <div className="drum">

            <Instrument>
                {
                    renderChildren(props.children, {
                        context: props.context,
                        destination: props.destination
                    })    
                }
            </Instrument>
            
        </div>

    )
}