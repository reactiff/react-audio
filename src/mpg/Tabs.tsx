import React from 'react'

import Nav from "react-bootstrap/Nav"
import Tab from "react-bootstrap/Tab"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { fnOrValue  } from '../shared/Util'
import {camelToSentenceCase} from '../shared/StringFunctions'

import Mpg from './Mpg'

import './css/tabs.css'

// METADATA
const $class = "mpg-tabs"
const $description = 'Creates Tabs with content panels for each key in supplied data object'
const $params = {
    data: { type: 'object', description: '', example: '{\n  key1: <component/>,\n  key2: <component/>\n}' },
    activeKey: { type: 'string', description: '', example: 'key1' },
    hiddenKey: { type: 'function', description: 'Key will be hidden if value is true', example: '(key) => true' },
    variant: { type: 'string', default: 'pills', options: 'pills|tabs' },
    alignTabsRight: { type: 'boolean'},
    onChange: {type: 'function'},
    stripMargin: {type: 'any'}
}

export default React.forwardRef((props: any,ref: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params)
        
    if(!component.data){
        return null
    }

    const keys = Object.keys(component.data).filter(key => component.data[key])

    const activeKey = component.activeKey || keys[0] //use first key by default

    const visibleKeys = keys.filter(key => {
        const hidden = props.hiddenKey ? props.hiddenKey(key) : false
        return !hidden
    })

    const tabsStyle: any = {}

    if(component.alignTabsRight){
        tabsStyle.justifyContent = 'flex-end';
    }

    if(component.stripMargin){
        tabsStyle.marginBottom = component.stripMargin
    }


    if(visibleKeys.length===1){
        return <Row>
            <Col>
            
                {
                    fnOrValue(component.data[visibleKeys[0]])
                }
            
            </Col>
        </Row>
    }

    return (
        
        <Tab.Container defaultActiveKey={activeKey} ref={ref}>
            <div className="mpg-tabs">
                <Row>
                    <Col>
                        <Nav variant={component.variant} style={tabsStyle}>
                            {
                                visibleKeys.map((key, i) => {
                                    const title = camelToSentenceCase(key)
                                    return (
                                        <Nav.Item key={i} title={title}>
                                            <Nav.Link eventKey={key} onClick={()=>component.onChange && component.onChange(key)}>{title}</Nav.Link>
                                        </Nav.Item>
                                    )
                                })
                            }
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tab.Content>
                            {
                                visibleKeys.map((key, i) => {

                                    return (
                                        <Tab.Pane key={i} eventKey={key} mountOnEnter={true}>
                                            {fnOrValue(component.data[key])}        
                                        </Tab.Pane>
                                    )
                                })
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </div>
        </Tab.Container>
    )
})

