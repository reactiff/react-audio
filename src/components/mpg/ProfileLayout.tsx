import React from 'react'
import {fnOrValue} from '../../shared/Util'

import './css/profilelayout.css'

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import Mpg from './Mpg'
import Button from 'react-bootstrap/Button'

const $class = "mpg-layout"
const $description = 'A common page layout, with Header, Main and Side panels'
const $params = {
    header: { type: 'any', description: 'Header content, can be a function' },
    main: { type: 'any', description: 'Main content, can be a function' },
    aside: { type: 'any', description: 'Side panel content, can be a function' },
    setTheme: { type:'function', required: true},
    theme: { type:'string', required: true},
    suppressFooter: {type: 'boolean'}
}
export default (props: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params)

    return (
        <article 
            
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')}    
        
            >
            <div className="container-fluid">

                <Row>
                
                    <Col>
                        <div className="title-section">
                            {fnOrValue(component.header)}
                        </div>
                    </Col>
                
                </Row>

                <Row>
                
                    {/* className="full-width-mobile" */}

                    <Col xs="12" md="8" className=""> 
                        <div className="content-section">
                            {fnOrValue(component.main)}
                        </div>
                    </Col>
                    
                    <Col xs="12" md="4" className="sidebar-section">

                        <div className="sidebar-item">
                            {fnOrValue(component.aside)}
                        </div>
                
                    </Col>
                </Row>

            </div>

            
            
        </article>
    )
  
}
  
  