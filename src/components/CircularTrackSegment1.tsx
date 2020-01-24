import React from 'react'
import {useState, useEffect, useRef} from 'react'

import Env from '../shared/Env'

export default (props: any) => {
  
  const s = props.segment;


  const segmentRef = useRef();

  // const [selected, setSelected] = useState(props.selected)
  // const [active, setActive] = useState(false)
  // const activate = async (durationMs: number, instrument: any) => {
  //   setActive(true);
  //   setTimeout(()=>{
  //     setActive(false);
  //   }, durationMs);
  // }


  const handleToggle = async () =>{
    // const value = !selected;
    props.playbackRef.toggleNote(props.trackId, props.beatIndex);

    //lift
    // if(value){
    //   props.playbackRef.subscribeTrackBeat(props.trackId, props.beatIndex, activate)
    // }
    // else{
    //   props.playbackRef.unsubscribeTrackBeat(props.trackId, props.beatIndex)
    // }

    // setSelected(value);
  }
  
  // useEffect(()=>{
  //   if(!s.indicator){
  //     return
  //   }
  //   props.playbackRef.subscribeTrackBeat('indicator', props.beatIndex, activate)
  //   return () => props.playbackRef.unsubscribeTrackBeat('indicator', props.beatIndex);
  // },[])
  

  const style: any = {};
  style.fill = 'rgba(40,40,40,0.3)';
  style.stroke = 'rgb(0,0,0)';

  //if(s.indicator){
    //style.fill = active ? 'rgba(' + props.color.join(',') + ',1)' : 'rgba(40,40,40,0.3)';
    
  //}
  //else{
    //const alpha = active ? 1 : 0.1;
    //style.fill = selected ? 'rgba(' + props.color.join(',') + ',' + alpha + ')' : 'rgba(40,40,40,0.2)';
    
    // style.opacity = active ? 1 : 1;
  //}

  useEffect(()=>{
    if(!segmentRef.current){
      throw new Error('Segment Ref is null')
    }
    props.onMount(segmentRef.current);
  },[]);
  
  const pathProps: any = {}
  if(!s.indicator){
    if(Env.isMobile){
      pathProps.onTouchStart = handleToggle
    }
    else {
      pathProps.onClick = handleToggle
    }
  }
  

  return <path 
    {...pathProps}
    className={"segment " + (s.indicator ? "indicator " : "") + " track-" + props.trackIndex + " beat-" + props.beatIndex}
    style={style}
    ref={segmentRef}
    d={`
      M ${s.points[0].x} ${s.points[0].y}
      A ${s.outerR} ${s.outerR} 0 0 1 ${s.points[1].x} ${s.points[1].y}
      L ${s.points[2].x} ${s.points[2].y}    
      A ${s.innerR} ${s.innerR} 0 0 0 ${s.points[3].x} ${s.points[3].y}
      L ${s.points[0].x} ${s.points[0].y}
      ` }
  />
      
           
      
      
      
  

}
