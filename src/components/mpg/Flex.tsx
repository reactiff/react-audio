import React from 'react'
import './css/flex.css'
import Mpg from './Mpg'

const keyClass = (value: any, key: any) => value && ({ class: key })
const keyValueClass = (value: any, key: any) => value && ({ class: key + '-' + value.replace(/\s/g, '-') })
const keyValueStyle = (value: any, key: any) => {
    if(value){
        const obj: any = { style: {} }
        obj.style[key] = value
        return obj
    }
}
const customClass = (name: any) => ({ class: name })
const customStyle = (key: any, value: any) => {
    const obj: any = { style: {} }
    obj.style[key] = value
    return obj
}

const $class = "mpg-flex"
const $description = 'Creates a flex container, making all children same size'
const $params = {

    direction: { type: 'string', options: ['row','row-reverse','column','column-reverse'], select: keyValueClass },
    wrap: { type: 'string', options: ['nowrap','wrap','wrap-reverse'], select: keyValueClass },
    flow: { type: 'string', options: ['row nowrap','column-reverse','column wrap','row-reverse wrap-reverse'], select: keyValueClass },
    order: { type: 'string', options: ['-1','0','1'], select: keyValueClass },

    justifyContent: { type: 'string', options: ['flex-start','flex-end','center','space-between','space-around','space-evenly'], select: keyValueClass  },
    alignItems: { type: 'string', options: ['flex-start','flex-end','center','baseline','stretch'], select: keyValueClass },
    alignContent: { type: 'string', options: ['flex-start','flex-end','center','space-between','space-around','space-evenly','stretch'], select: keyValueClass },

    basis: { type: 'string', options: ['30%','50%','content'], select: keyValueStyle },

    

    //short hand directives

    row: { type: 'boolean', select: (value: any, key: any)=>customClass('direction-'+key)  },
    column: { type: 'boolean', select: (value: any, key: any)=>customClass('direction-'+key) },

    padded: { type: 'boolean', select: keyClass },


} 

export default React.forwardRef((props: any, ref: any) => {

    const component: any = Mpg.PropsParser.parse($class, props, $params)
    
    const data = Array.isArray(component.data) ? component.data : [component.data]

    if(ref) {
        component.other.ref = ref
    }
    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >

            {data}
            
        </div>
    )

})
    
