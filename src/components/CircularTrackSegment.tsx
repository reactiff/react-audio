import React from 'react'
import {useState, useEffect, useRef} from 'react'

import Env from '../shared/Env'
import getTrackColors from './getTrackColors'

export default (props: any) => {
  
  const s = props.segment;
  const elementRef: any = useRef();
  
  const classNames = ["segment", props.hashKey, 'CLASS'];

  const colors: any = getTrackColors(s.trackIndex);

  const getColor = (currentMeasure: any, currentbeat: number) => {

    if(currentMeasure[s.trackIndex][s.beatIndex] === true){ //if beat is selected

      if(s.beatIndex === currentbeat && props.playbackRef.state !== 0) { //if active and NOT STOPPED 
        return [colors.segment.active, colors.segment.selected];
      }
      else{
        return [colors.segment.selected];
      }

    }
    else{
      return [colors.segment.default];
    }
  }

  const getState = (currentbeat: number) => {

    if(props.playbackRef.currentMeasure[s.trackIndex][s.beatIndex] === true){ //if beat is selected

      return 'SELECTED';

    }
    else{
      return '';
    }
  }

  const handleToggle = async () =>{
    props.playbackRef.toggleNote(s.trackId, s.beatIndex);
  }
  

  const handleBeat = async (currentMeasure: any, currentBeat: number, duration: number) => {
    
    // const cellState = getState(currentBeat);

    // elementRef.current.setAttribute("state", cellState); 
    
    const color = getColor(currentMeasure, currentBeat);
    elementRef.current.style.fill = color[0];

    if(color.length>1){
      setTimeout(()=>{
        elementRef.current.style.fill = color[1];
      }, duration)
    }
    
  }

  
  const initialStyle = {
    fill: props.currentMeasure[s.beatIndex] ? colors.segment.selected : colors.segment.default,
  };
  
  
  
  useEffect(()=>{
    return props.playbackRef.subscribe('onBeat', handleBeat, {beatIndex: s.beatIndex});
  },[]);
  

  const pathProps: any = {}
  if(Env.isMobile){
    pathProps.onTouchStart = handleToggle
  }
  else {
    pathProps.onClick = handleToggle
  }

  return <path 
    {...pathProps}
    className={classNames.join(' ')}
    style={initialStyle}
    ref={elementRef}
    d={`
      M ${s.points[0].x} ${s.points[0].y}
      A ${s.outerR} ${s.outerR} 0 0 1 ${s.points[1].x} ${s.points[1].y}
      L ${s.points[2].x} ${s.points[2].y}    
      A ${s.innerR} ${s.innerR} 0 0 0 ${s.points[3].x} ${s.points[3].y}
      L ${s.points[0].x} ${s.points[0].y}
      ` }
  />
      
           
      
      
      
  

}
