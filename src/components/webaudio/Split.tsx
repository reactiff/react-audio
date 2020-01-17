import React from 'react';

import SplitModule, {SplitInputModule, SplitReturnModule} from './modules/SplitModule';

import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'

type SplitPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    //component specific
    startValue?: number,
    endValue?: number,
    duration?: number
}

export default class Split extends React.Component {

    renderedChildren: any = null;
    proxy: any = null;

    constructor(props: SplitPropsType) {
        super(props)

        this.proxy = new SplitModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        props.target.registerSource(this.proxy);
        
        this.renderedChildren = renderChildren(this.props.children, {
            context: props.context,
            target: this.proxy
        })   
    }
    
    static get Input() {
        return SplitInput;
    }

    static get Return() {
        return SplitReturn;
    }

    render(){

        return (
            <div className="split">
                {
                    this.renderedChildren
                }
            </div>
        );

    }
    
}


type InputPropsType = {
    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,
}
const SplitInput = (props: InputPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new SplitInputModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        props.target.registerInputNode(proxy);
        props.target.registerSource(proxy); 

        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <div className="split-input">
            {children}
        </div>
    );
}


type ReturnPropsType = {
    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,
}
const SplitReturn = (props: ReturnPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new SplitReturnModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        props.target.registerReturnNode(proxy);
        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <div className="split-return">
            {children}
        </div>
    );
}