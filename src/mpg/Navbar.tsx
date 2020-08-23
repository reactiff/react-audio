import React from 'react'


import {Nav, Button} from 'react-bootstrap'

import Mpg from './Mpg'

import './css/navbar.css'
import { useHistory, useLocation } from 'react-router-dom'

const $class = "mpg-navbar"
const $description = 'Nav toolbar, top in desktop, bottom in mobile.'
const $params = {
    routes: { type: 'any' }, 
    location: {type: 'string'},
    fixedTop: {type: 'boolean'},
    fixedBottom: {type: 'boolean'},
}

export default React.forwardRef((props: any, ref: any) => {

    const history = useHistory()
    const location = useLocation()

    const { match, staticContext, ...rest } = props;

    const navigate = (url: string) => {
        history.push(url)
    }

    const component: any = Mpg.PropsParser.parse($class, rest, $params)

    if(props.fixedTop){
        component.classes.push('fixed-top')
    }

    if(props.fixedBottom){
        component.classes.push('fixed-bottom')
    }

    return (
        
        <Nav 
            ref={ref}
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            variant="pills"
        >
            {
                Object.keys(component.routes).map(key => {

                    const route = component.routes[key]
                    const classes = ["flex tight column justify-center"];

                    if(route.exact){
                        if(location.pathname.trim().toLowerCase() === route.path){
                            classes.push('active')
                         }
                    }
                    else{
                        if(location.pathname.trim().toLowerCase().indexOf(route.path) === 0 ){
                            classes.push('active')
                         }
                    }
                    

                    return <Nav.Item key={key}>
                        <Nav.Link onClick={()=>navigate(route.path)} className={classes.join(' ')}>
                            <Mpg.Flex column tight justifyContent="center">
                                <Mpg.div>
                                    <Mpg.FontAwesomeIcon icon={route.icon} size="2x"/>
                                </Mpg.div>
                                <Mpg.div>
                                    <small>{key.toUpperCase()}</small>
                                </Mpg.div>
                            </Mpg.Flex>
                        </Nav.Link>
                    </Nav.Item>
                })
            }

            {
                <Nav.Item className="spacer">
                    &nbsp;
                </Nav.Item>
            }
        </Nav>
    )
})
    
