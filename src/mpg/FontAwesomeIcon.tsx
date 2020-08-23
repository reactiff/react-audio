import React from 'react'
import Mpg from './Mpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './css/responsiveheader.css'

const $class = "mpg-fa-icon"
const $description = 'FontAwesome icon'
const $params = {
    icon: { type: 'any' },
    size: { type: 'any' },
    rotateDegrees: {type: 'number' },
}
const $sampleProps = {  }
export default (props: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params)

    if(component.rotateDegrees){
        component.style.transform = 'rotate('+ component.rotateDegrees +'deg)'
    }

    return (
        <FontAwesomeIcon 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            icon={component.icon} size={component.size}/>
    )
}
    

