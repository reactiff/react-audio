import React from 'react'
import PropTypes from "prop-types";

import {useState} from 'react'
import {useLocation} from 'react-router-dom'

import Mpg from './Mpg'
import DisclosureView from './DisclosureView'

import './css/disclosure.css'

import {toCamelCase} from '../shared/StringFunctions'
import {toProperCase} from '../shared/StringFunctions'

const $class = "mpg-disclosure block transparent touch"
const $description = 'Disclosure button, which opens an overlay view with back button'
const $params = {
    caption: {type: 'string'},
    active: {type: 'boolean'},
    transparent: {type: 'boolean'},
    viewKey: {type: 'string'},
    icon: {type: 'string'},
    iconSize: {type: 'string', default: '1x'},
    iconElement: {type: 'any'},
    onClick: {type: 'function'},
    onOpen: {type: 'function'},
    onClose: {type: 'function'},
    header: { type: 'any' },
    action: {type: 'function'},
}

const Disclosure = (props: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params)

    const location = useLocation()
    let disclosureViewHash: any = null;
    
    if(props.viewKey && props.caption) {
        disclosureViewHash = location.pathname + '/' + props.viewKey + (props.caption ? '/' + toCamelCase(props.caption) : '');
    }
    
    let storedState = null;
    if(disclosureViewHash){
        storedState = sessionStorage.getItem(disclosureViewHash) === 'true';
    }
    
    let restoreView = storedState && props.children ? true : false;

    const [viewOpen, setViewOpen] = useState(restoreView)
    const handleOpenView = () => {

        if(props.onClick){
            props.onClick()
        }

        if(props.children){
            setViewOpen(true)
        }
        
    }

    const handleViewOpened = () => {
        props.onOpen && props.onOpen()
        if(disclosureViewHash){
            sessionStorage.setItem(disclosureViewHash, 'true')
        }
    }

    const handleViewClosed = () => {
        setViewOpen(false)
        if(disclosureViewHash){
            sessionStorage.setItem(disclosureViewHash, 'false')
        }
        props.onClose && props.onClose()
    }

    const iconClass = props.active ? 'active' : ''
    return <>

        {
            !props.action &&
            !props.transparent &&
            <Mpg.Button 
                className={$class} 
                onClick={handleOpenView}
                >
                <Mpg.Flex row solid padded alignItems="center" marginBottom={1} {...component.other} style={component.style} className={component.classes.join(' ')}>   
                    {
                        props.icon &&
                        <Mpg.div textAlign="center">
                            <Mpg.FontAwesomeIcon icon={component.icon} size={component.iconSize} className={iconClass}/>
                        </Mpg.div>
                    }

                    {
                        props.iconElement && 
                        <Mpg.div>
                            {props.iconElement}
                        </Mpg.div>
                    }

                    {
                        component.caption &&
                        <Mpg.div grow>
                            {component.caption}
                        </Mpg.div>
                    }
                    

                    {
                        props.children &&
                        <Mpg.div>
                            <Mpg.FontAwesomeIcon icon="chevron-right"/>
                        </Mpg.div>
                    }
                    
                </Mpg.Flex>
            </Mpg.Button>
        }

        {
            !props.action &&
            props.transparent &&
            <Mpg.Button 
                marginBottom={1} 
                {...component.other} style={component.style} className={$class + ' ' + component.classes.join(' ')}
                
                onClick={handleOpenView}
                >
                <Mpg.Flex row justifyContent="center" alignItems="center" noMargin >   
                    {
                        props.icon &&
                        <Mpg.div textAlign="center">
                            <Mpg.FontAwesomeIcon icon={component.icon} size={component.iconSize} className={iconClass}/>
                        </Mpg.div>
                    }

                    {
                        props.iconElement && 
                        <Mpg.div>
                            {props.iconElement}
                        </Mpg.div>
                    }

                    {
                        component.caption &&
                        <Mpg.div grow>
                            {component.caption}
                        </Mpg.div>
                    }
                                        
                    
                </Mpg.Flex>
            </Mpg.Button>
        }   

        {
            props.action &&
            <Mpg.Flex row solid padded alignItems="center" marginBottom={1} {...component.other} style={component.style} className={component.classes.join(' ')}>   
                {
                    props.icon &&
                    <Mpg.div width={20} textAlign="center">
                        <Mpg.FontAwesomeIcon icon={component.icon} size={component.iconSize} className={iconClass}/>
                    </Mpg.div>
                }

                {
                    props.iconElement && 
                    <Mpg.div>
                        {props.iconElement}
                    </Mpg.div>
                }

                <Mpg.div grow>
                    {component.caption}
                </Mpg.div>

                {/* {
                    <Mpg.ActionButton onClick={async () => {
                        
                        const result = await component.action().catch((err: any) => {
                                throw new Error(err.message)
                            })        

                        if(!result.ok){
                            return false
                        }

                        return true
                        
                    }}>
                        {component.caption.camelToSentenceCase().split(' ')[0]}
                    </Mpg.ActionButton>
                    
                
                } */}
                
            </Mpg.Flex>
        
        }
       
        
        {/* {
            props.transparent &&
            <button 
                {...component.other} style={component.style} className={$class + ' ' + component.classes.join(' ')}
                onClick={handleOpenView}
                >

            </button>
        } */}

        {
            viewOpen && 
            props.children && 
            <DisclosureView
                header={props.header}
                onOpen={handleViewOpened}
                onClose={handleViewClosed}
                restore={restoreView}
                
                >
                {props.children}
            </DisclosureView>
        }
    </>
}
    
export default Disclosure;