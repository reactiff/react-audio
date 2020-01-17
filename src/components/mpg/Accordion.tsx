import React from 'react'
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"
import {camelToSentenceCase} from '../../shared/StringFunctions'

import './css/accordion.css'

import Mpg from './Mpg'

// METADATA
const $class = "mpg-accordion"
const $description = 'Creates an accordion with expandable content panel for each key in supplied data object.  Camel cased keys get parsed to sentence case and are used as captions.'
const $params = {
    data: { type: 'object', description: '', example: '{ key1: <component/>,key2: <component/> }\n', select: null },
    activeKey: { type: 'string', description: '', example: 'key1', select: null },
    titleForKey: { type: 'function', example: '(key) => key.toProperCase()' }
}
export default (props: any) => {
    
    const component: any = Mpg.PropsParser.parse($class, props, $params)
    
    const keys = Object.keys(component.data)

    const activeKey = component.activeKey || keys[0] //use first key by default

    return (

        
        <Accordion 
        
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 

            defaultActiveKey={activeKey}>  
            
            {
                keys.map((key, i) => {

                    const title = props.titleForKey ? props.titleForKey(key) : camelToSentenceCase(key)
                    
                    return (
                        <Card key={i} >
                            <Accordion.Toggle as={Card.Header} eventKey={key}>
                                {title}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={key}>
                                <Card.Body>
                                    {component.data[key]}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )
                })
            }
                
        </Accordion>
    )
}
