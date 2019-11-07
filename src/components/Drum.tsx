import React from 'react';

import Instrument from './Instrument'
import renderChildren from './renderChildren'

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