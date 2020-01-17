import React from 'react'
import {useState, useEffect, useRef} from 'react'
import Mpg from './Mpg'

import {Button} from 'react-bootstrap'

import './css/disclosureview.css'
import { fnOrValue } from '../../shared/Util'

const NAVBAR_HEIGHT = 74

export default (props: any) => {

    const [viewRef, setViewRef] = useState<any>(null)

    const mountedInPortal = (ref: any) => {

        const animationDelay = props.restore ? 0 : 100
        const transitionTime = props.restore ? 0 : 0.2

        setTimeout((ref)=>{

            ref.current.style.transition = 'left ' + transitionTime.toFixed(1) + 's ease-out'
            ref.current.style.left = '0%'

        }, animationDelay, ref)
        
        setTimeout((ref)=>{
            props.onOpen && props.onOpen()
        }, animationDelay + transitionTime * 100)

        setViewRef(ref)

    }

    /// Called when mounted in the portal
    const main = () => {

        return <div className="disclosure-view-container">

                <div className="disclosure-view-relative-container">

                    <Mpg.Flex row padded alignItems="center" className="disclosure-view-header">
                        <Button variant="link" 
                            className="no-padding" 
                            style={{paddingLeft: 10, margin: 0}} 
                            onClick={() => {
                                viewRef!.current!.style.transition = 'left 0.2s ease-out'
                                viewRef!.current!.style.left = '100%'
                                setTimeout(props.onClose, 200)
                            }}>
                            <Mpg.FontAwesomeIcon icon='chevron-left' size="2x" />
                        </Button>

                        {
                            typeof props.header === 'string' &&
                            <Mpg.div grow>{props.header}</Mpg.div>
                        }

                        {
                            typeof props.header !== 'string' &&
                            props.header
                        }
                        
                    </Mpg.Flex>


                    <Mpg.div className="disclosure-view-body scrollable vertical">
                        <div className="container-fluid">
                        {
                            fnOrValue(props.children)
                        }
                        </div>
                    </Mpg.div>

                </div>
            </div>
    }
    
    

    return <Mpg.Portal id="disclosureView" targetContainer="fixedRoot" onMount={mountedInPortal}>
        {
            main
        }
    </Mpg.Portal>

    

}
