import React, { useEffect } from 'react'

const ThemeLoader = (props: any) => {

    const {theme} = props

    const classes: string[] = []

    if(theme && theme.length>0){
        classes.push(theme + '-mode')
    }

    useEffect(()=>{
        document.body.className = classes.join(' ')
    }, [theme])

    return null
}

export default ThemeLoader