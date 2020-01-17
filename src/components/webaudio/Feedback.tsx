import React from 'react';

import FeedbackModule, {FeedbackReturnModule} from './modules/FeedbackModule';

import renderChildren from './renderChildren'
import paramsFromProps from './paramsFromProps'

import './css/gain.css'

type FeedbackPropsType = {

    //standard props
    children?: any,
    context?: AudioContext,
    target?: any,

    name?: string
}

export default class Feedback extends React.Component {

    renderedChildren: any = null;
    proxy: any = null;

    constructor(props: FeedbackPropsType) {
        super(props)

        this.proxy = new FeedbackModule(
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
    
    static get Return() {
        return FeedbackReturn;
    }

    render(){

        return (
            <div className="feedback">
                {
                    this.renderedChildren
                }
            </div>
        );

    }

}

type FeedbackReturnPropsType = {
    //standard props
    children?: any,
    context?: AudioContext,
    target?: any

    for?: string
}
const FeedbackReturn = (props: FeedbackReturnPropsType) => {

    let children = null;

    if(props.context){
        
        const proxy = new FeedbackReturnModule(
            props.target,
            props.context,
            paramsFromProps(props)
        );

        const parent = props.target.findParent('Feedback', props.for);
        parent.registerReturnNode(proxy);

        props.target.registerSource(proxy);
        
        children = renderChildren(props.children, {
            context: props.context,
            target: proxy
        })   

    }
    
    return (
        <div className="feedback-return">
            {children}
        </div>
    );
}