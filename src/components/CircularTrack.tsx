import React from 'react'
import {useState, useEffect, useMemo, useRef} from 'react'
import Mpg from './mpg/Mpg'
import uuid from 'uuid/v4'

import CircularTrackSegment from './CircularTrackSegment'

import './css/circulartrack.css'

export default (props: any) => {

  const track = props.data;

  const wheelR = props.wheelRadius;
  const R = props.outerRadius;
  const W = props.width;
  const innerR = R - W;

  
  //const [measureData, setMeasureData] = useState<any>(initialData)
  const [segments, setSegments] = useState<any[]>([])
  
  const getTrackColor = () => {
    if(props.indicator){
      return [255,255,255];
    }
    switch(props.trackIndex){
      case 0:
        return [255,0,0];
      case 1:
        return [255,255,0];
      case 2:
        return [0,255,255];
      case 3:
        return [0,255,0];
      case 4:
        return [255,0,255];
      default:
        return [255,255,255];
    }
  }
  const rgb = getTrackColor();

  const segmentRefs: any = useRef({});
  const handleSegmentMounted = (index: number, segmentRef: any) => {
    segmentRefs.current[index] = segmentRef;
  };

  
  const colors: any = {
    indicator: {
      default: 'rgba(40, 40, 40, 0.3)',
      active: 'white',
    },
    segment: {
      default: 'rgba(40, 40, 40, 0.3)',
      selected: 'rgba(' + rgb.join(', ') + ', 0.2)',
      active: 'rgba(' + rgb.join(', ') + ', 1)'
    }
  };

  const setSegmentColor = (index: number, duration?: number) => {

    const segment = segmentRefs.current[index];

    if(track.indicator){
      segment.style.fill = track.currentBeat === index  ? colors.indicator.active : colors.indicator.default;
    }
    else{
      if(track.currentMeasure[index] === true){ //if beat is selected
        if(track.currentBeat === index && props.playbackRef.state !== 0) { //if active and NOT STOPPED 
          
          if(segment.style.fill !== colors.segment.active){
            segment.style.fill = colors.segment.active;
          
            setTimeout(()=>{
              segment.style.fill = colors.segment.selected;
            }, duration);
          }
          

        }
        else{
          if(segment.style.fill !== colors.segment.selected){
            segment.style.fill = colors.segment.selected;
          }
        }
      }
      else{
        if(segment.style.fill !== colors.segment.default){
          segment.style.fill = colors.segment.default;
        }
      }
    }
  }

  track.processMeasure = () => { 
    for(let i=0; i<track.beats; i++){
      setSegmentColor(i);
    }
  };

  track.processBeat = (duration: number) => { 
    let prevBeat = track.currentBeat - 1;
    if(prevBeat<0){
      prevBeat = track.beats - 1;
    }
    setSegmentColor(prevBeat, 0);
    setSegmentColor(track.currentBeat, duration);
  };
  
    
  useEffect(() => {

    const angularStep = Math.PI * 2 / track.beats;
    const angularOffset = -Math.PI / 2;

    const arr: any[] = Array.from({length: track.beats}).map((beat, index) => {

      const pi1 = angularStep * index + angularOffset;
      const pi2 = angularStep * (index + 1) + angularOffset;

      const xFn = Math.cos
      const yFn = Math.sin

      //segment
      return {
        id: uuid(),
        index: index,
        indicator: props.indicator,
        outerR: R,
        innerR: innerR,
        points: [
          {x: xFn(pi1) * R + wheelR, y: yFn(pi1) * R + wheelR},
          {x: xFn(pi2) * R + wheelR, y: yFn(pi2) * R + wheelR},
          {x: xFn(pi2) * innerR + wheelR, y: yFn(pi2) * innerR + wheelR},
          {x: xFn(pi1) * innerR + wheelR, y: yFn(pi1) * innerR + wheelR},
        ]
      }

    })

    setSegments(arr);

  }, [track.id]);


  return <> 
    
    {
      segments.map((s, index) => <CircularTrackSegment 
        key={index} 
        segment={s} 
        onMount={(segmentRef: any) => handleSegmentMounted(index, segmentRef)}
        playbackRef={props.playbackRef} 
        //selected={measureData[index] === true}
        //color={getTrackColor(props.trackIndex)} 
        trackId={track.id} 
        trackIndex={props.trackIndex} 
        beatIndex={index} 
      />)


    }

  </>;

}
