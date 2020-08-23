import React from 'react'
import {useState, useEffect, useRef} from 'react'

import Env from '../shared/Env'
import getTrackColors from './getTrackColors'

export default (props: any) => {
  
  const s = props.segment;

  const elementRef: any = useRef();
  const stateRef: any = useRef({});
  
  const classNames = ["segment", props.hashKey];

  const colors: any = getTrackColors(s.trackIndex);
  const getColor = (currentBeat?: number) => {
    if(stateRef.current.selected === true){ //if beat is selected
      if(s.beatIndex === currentBeat && props.playbackRef.state !== 0) { //if active and NOT STOPPED 
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

  const handleToggle = async () =>{

    stateRef.current.selected = !stateRef.current.selected;
    const color = getColor(-1);
    elementRef.current.style.fill = color[0];
    // elementRef.current.setAttribute('selected', stateRef.current.selected ? 'true' : 'false');
    // elementRef.current.setAttribute('setter', 'handleToggle');

    props.playbackRef.setNoteSelected(s.trackIndex, s.beatIndex, stateRef.current.selected);

  }
  
  const handleMeasureStateChanged = async (value: boolean, currentBeat: number, measureNumber: number) => {

    stateRef.current.selected = value;
    stateRef.current.measureNumber = measureNumber;
    

    const color = getColor(currentBeat);
    elementRef.current.style.fill = color[0];
    // elementRef.current.setAttribute('selected', stateRef.current.selected ? 'true' : 'false');
    // elementRef.current.setAttribute('setter', 'handleMeasureStateChanged');
  }; 

  const handleStepActivated = async (duration: number, measureNumber: number) => {

    const color = getColor(s.beatIndex);
    
    elementRef.current.style.fill = color[0];
    // elementRef.current.setAttribute('selected', stateRef.current.selected ? 'true' : 'false');
    // elementRef.current.setAttribute('setter', 'handleStepActivated');
    // elementRef.current.setAttribute('duration', duration);

    const looping = props.playbackRef.state === 2;

    if(color.length > 1 && (looping || s.beatIndex < s.trackBeats - 1)){
      setTimeout(()=>{
        elementRef.current.style.fill = color[1];
        // elementRef.current.setAttribute('selected', stateRef.current.selected ? 'true' : 'false');
        // elementRef.current.setAttribute('setter', 'handleStepActivated Timeout');
        // elementRef.current.setAttribute('duration', duration);
      }, duration)
    }

  }
  
  // const initialStyle = {
  //   fill: props.currentMeasure[s.beatIndex] ? colors.segment.selected : colors.segment.default,
  // };
  
  useEffect(()=>{

    const unsubscribeOnStepActivated = props.playbackRef.onStepActivated(s.trackIndex, s.beatIndex, handleStepActivated);
    const unsubscribeOnStepSelected = props.playbackRef.onStepSelected(s.trackIndex, s.beatIndex, handleMeasureStateChanged);

    const cleanup = () => {
      unsubscribeOnStepActivated();
      unsubscribeOnStepSelected();
    };

    return cleanup;

  },[]);
  

  const pathProps: any = {}
  if(Env.isMobile){
    pathProps.onTouchStart = handleToggle
  }
  else {
    pathProps.onClick = handleToggle
  }

  console.log('render <CircularTrackSegment />');

  return <path 
    {...pathProps}
    className={classNames.join(' ')}
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
