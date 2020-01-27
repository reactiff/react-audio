import React from 'react'
import {useState, useEffect, useMemo, useRef} from 'react'
import Mpg from './mpg/Mpg'
import uuid from 'uuid/v4'

import CircularTrackSegment from './CircularTrackSegment'

import './css/circulartrack.css'

export default (props: any) => {

  const track = props.track;
  const wheelR = props.wheelRadius;
  const R = props.outerRadius;
  const W = props.width;
  const innerR = R - W;
  
  const keys = Array.from({length: track.beats});

  // const _current_measure_ = props.currentMeasure;
  // const datastr = keys.map(key => _current_measure_[key] ? '1' : '_').join('');
  
  const angularStep = Math.PI * 2 / keys.length;
  const angularOffset = -Math.PI / 2;

  return <>
    {
      keys.map((key, index) => {

        const pi1 = angularStep * index + angularOffset;
        const pi2 = angularStep * (index + 1) + angularOffset;
    
        const xFn = Math.cos
        const yFn = Math.sin
    
        //segment
        const s = {
          // id: uuid(),
          // indicator: props.indicator,
          trackId: track.id,
          trackIndex: props.trackIndex,
          beatIndex: index,
          trackBeats: track.beats,
          outerR: R,
          innerR: innerR,
          points: [
            {x: xFn(pi1) * R + wheelR, y: yFn(pi1) * R + wheelR},
            {x: xFn(pi2) * R + wheelR, y: yFn(pi2) * R + wheelR},
            {x: xFn(pi2) * innerR + wheelR, y: yFn(pi2) * innerR + wheelR},
            {x: xFn(pi1) * innerR + wheelR, y: yFn(pi1) * innerR + wheelR},
          ]
        };
    
        return <CircularTrackSegment 
          key={index} 
          segment={s} 
          // currentMeasure={props.currentMeasure}
          playbackRef={props.playbackRef} 
          hashKey={track.id}
        />
    
    
      })
    }
  </>
  
  

  

  
}
