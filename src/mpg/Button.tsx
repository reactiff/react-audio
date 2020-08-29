import React from 'react';
import {Button} from 'react-bootstrap';
import Mpg from './Mpg';

const $class = '';
const $description = '';
const $params = {
    // onClick: { type: 'function' },
    link: { type: 'boolean' },

} 



export default (props: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params, true)

    if(component.style && Object.keys(component.style).length) {
        component.other.style = component.style;
    }

    if(component.classes && component.classes.length) {
        component.other.className = $class + ' ' + component.classes.join(' ')
    }

    if (component.link) {
        component.other.variant = 'link';
    }

    return (
        <Button 
            {...component.other}
            style={component.style}
            className={component.classes.join(' ')} 
        >
            {props.text}
            {props.children}
        </Button>
    )
    
}
