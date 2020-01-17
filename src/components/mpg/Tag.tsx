import React from 'react'

import * as ReactBootstrap from 'react-bootstrap'

import Mpg from './Mpg'

const $class = "mpg-tag"
const $description = 'A generic tag, which can be rendered as any valid HTML or react element'
const $params = {
    element: {type: 'element'},
    as: { type: 'string', description: 'Name of a valid HTML or React tag', example: 'ul' }
} 



export default (props: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params, true)
    
    const element = component.element 
    const tagName = component.as 

    if(component.style && Object.keys(component.style).length) {
        component.other.style = component.style
    }

    if(component.classes && component.classes.length) {
        component.other.className = $class + ' ' + component.classes.join(' ')
    }

    return React.createElement(element || tagName, component.other)
    
}
