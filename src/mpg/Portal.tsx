import React from 'react'
import {useEffect, useState, useRef} from 'react'

import ReactDOM from 'react-dom'

//import './css/portal.css'

import Mpg from './Mpg'
import { fnOrValue } from '../shared/Util'

const $class = "mpg-portal"
const $description = 'Mpg.Portal uses React Portals, enabling you to render components ANYWHERE in the DOM'
const $params = {
    id: { type: "string", description: "Identifier for the component's container" },
    targetContainer: { type: "string", description: "Target container ID string" },
    data: { type: 'element' },
    createRef: {type: 'boolean'},
    onMount: {type: 'function'},
}

export default (props: any) => {
   
    const component: any = Mpg.PropsParser.parse($class, props, $params)
    
    const childRef = useRef()
    const [targetContainerElement, setTargetContainerElement] = useState<any>(null)

    useEffect(()=>{

        if(!targetContainerElement){
            let target
            if(typeof component.targetContainer === 'string'){
                target = document.getElementById(component.targetContainer)
            } else {
                target = component.targetContainer
            }
        
            if(!target){
                return
            }

            setTargetContainerElement(target)
            return
        }
        
    }, [childRef.current])


    if(!targetContainerElement){
        return null
    }
    
    let componentContainer: any = null;
    
    if(component.id) {
        componentContainer= document.getElementById(component.id)
    }

    if(!componentContainer){
        var node = document.createElement("div");                 
        node.id = component.id
        node.className = $class + ' ' + component.classes.join(' ')
        targetContainerElement.appendChild(node);
        componentContainer = document.getElementById(component.id)
    }

    const awaitMount = () => {
        if(childRef.current){
            if(props.onMount){
                props.onMount(childRef)
            }
            return 
        }
        requestAnimationFrame(awaitMount)
    }

    if(props.onMount){
        const childElement = fnOrValue(component.data)
        const withRef = React.cloneElement(childElement, {ref: childRef})
        requestAnimationFrame(awaitMount)
        return ReactDOM.createPortal(withRef, componentContainer);
    }
    else{
        const childElement = fnOrValue(component.data)
        return ReactDOM.createPortal(childElement, componentContainer);
    }

    
}
    