import React, { useRef } from 'react'
import {useState, useEffect, useMemo} from 'react'
import uuid from 'uuid/v4'

import Mpg from './mpg/Mpg'
import './css/loops.css'
import { useWindowSize } from '../hooks/Hooks'

import CircularTrack from './CircularTrack'
import Playback from './Loops/Playback'

import Analyzer from './webaudio/Analyzer';
import AudioContext from './webaudio/AudioContext';
import AudioSource from './webaudio/AudioSource';
import Constant from './webaudio/Constant';
import Delay from './webaudio/Delay';
import Feedback from './webaudio/Feedback';
import Filter from './webaudio/Filter';
import { FilterType } from './webaudio/modules/FilterModule';
import Gain from './webaudio/Gain';
import Instrument from './webaudio/Instrument';
import Noise from './webaudio/Noise';
import Oscillator from './webaudio/Oscillator';
import Param from './webaudio/Param';
import Position from './webaudio/Position';
import Recorder from './webaudio/Recorder'
import Slider from './webaudio/Slider';
import Split from './webaudio/Split';
import Stereo from './webaudio/Stereo';
import {TransitionMethod} from './webaudio/modules/ParamModule';
import Inline from '../shared/Inline'

const inputArray = [
  '1000101010001000'
]
export default (props: any) => {

  const tracks = useRef<any[]>([
    { id: uuid(), beats: 16, measures: {}, inputArray: inputArray, foundation: true },
    { id: uuid(), beats: 16, measures: {}},
    { id: uuid(), beats: 16, measures: {}},
    { id: uuid(), beats: 16, measures: {}},
    { id: uuid(), beats: 16, measures: {}},
    
    // 1: { id: uuid(), beats: 12, beatDuration: 1/12 },
  ]);

  const [playbackState, setPlaybackState] = useState(0)
  const [bpm, setBpm] = useState(100)
    
  const [currentMeasureNumber, setCurrentMeasureNumber] = useState(0)
  const [currentMeasure, setCurrentMeasure] = useState<any[]>([])
  const [currentBeat, setCurrentBeat] = useState<number | null>(null)
  
  const windowSize = useWindowSize()
  const maxDiameter = 200; //Math.min(windowSize.width, windowSize.height - 55 - 30)
  const maxRadius = maxDiameter / 2 
  const trackWidth = Math.min((maxRadius - 60) / (tracks.current.length ), 60);
  

  // handlers
  const handleMeasureChange = (measureNumber: number, data: any[]) => {
    setCurrentMeasureNumber(measureNumber);
    setCurrentMeasure(data);
    
  }
  

  const handlePlayStop = () => {
    playbackRef.current.trigger();
  }
  
  const handleRegisterInstrument = (instance: any) => {
    let availableTrackIndex = 0;
    while(playbackRef.current.tracks[availableTrackIndex].instrument){
      availableTrackIndex++;
      if(!playbackRef.current.tracks[availableTrackIndex]){
        return
      }
    }
    if(playbackRef.current.tracks[availableTrackIndex]){
      playbackRef.current.tracks[availableTrackIndex].instrument = instance;
    }
  }

  const playbackRef = useRef<any>(new Playback());

  useEffect(()=>{

    //playback component
    playbackRef.current.subscribe('onStateChange', setPlaybackState);
    playbackRef.current.subscribe('onMeasureChange', handleMeasureChange);
    
    playbackRef.current.setTracks(tracks.current);
    playbackRef.current.init();

  },[]);
  

  //memoized
  const playButton = useMemo(() => {
    let icon = Inline.switch(playbackState, 'play', 1, 'stop', 2, 'play-circle')
    return <Mpg.FontAwesomeIcon icon={icon} size="2x"/>
  }, [playbackState])

  if(currentMeasure.length===0){
    return null;
  }

  

  return <>

    <Mpg.Flex className="loop-panel" translucent tight alignItems="center" justifyContent="center" noMargin column>  

      <Mpg.div style={{display: 'none'}}>

        <AudioContext>

          <Instrument name="Kick" registerInstrument={handleRegisterInstrument}> 
            <Gain value={1} targetValue={0.001} duration={0.4}>
              <Oscillator type="sine" >
                <Param name="frequency" value={100} targetValue={0.001} duration={0.4} method={TransitionMethod.Exponential} ></Param>
              </Oscillator>
            </Gain>
          </Instrument>

          <Instrument name="Snare" registerInstrument={handleRegisterInstrument}>
            
              {/* <Gain value={0.1} targetValue={0.001} duration={0.2}>
                <Noise duration={0.2} playbackRate={1}></Noise>
              </Gain> */}
            
              <Gain value={1} targetValue={0.001} duration={0.2}>
                <Oscillator type="sine" duration={0.2}>
                  <Param name="frequency" value={400} targetValue={1} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain>

              {/* <Gain value={0.2} targetValue={0.001} duration={0.1}>
                <Oscillator type="square" duration={0.2}>
                  <Param name="frequency" value={2000} targetValue={0.001} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain> */}

          </Instrument>


          <Instrument name="HiHat" registerInstrument={handleRegisterInstrument}>
            {/* <Filter type={FilterType.lowpass} frequency={11000} Q={1}> */}
            
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.5} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={-0.5}>
                    <Noise duration={0.1} playbackRate={1.5} />
                  </Stereo>
                </Gain>
              </Filter>
            
            {/* </Filter> */}
          </Instrument>

          <Instrument name="Offbeat Hihat" registerInstrument={handleRegisterInstrument}>
            {/* <Filter type={FilterType.lowpass} frequency={11000} Q={1}> */}
            
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                
                <Gain value={0.1} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={0.5}>
                    <Noise duration={0.1} playbackRate={1} />
                  </Stereo>
                </Gain>
                
              </Filter>
            
            {/* </Filter> */}
          </Instrument>

          <Instrument name="Clap" registerInstrument={handleRegisterInstrument}>
            <Filter type={FilterType.highpass} frequency={1000} Q={10}>
              <Gain value={0.5} targetValue={0.00001} duration={0.5}>
                <Noise duration={0.3} playbackRate={2}></Noise>
              </Gain>
            </Filter>
          </Instrument>

          

        </AudioContext>

      </Mpg.div>



      <Mpg.div className="loop-wheel-container" width={maxDiameter} height={maxDiameter}>
        {/* LOOP WHEEL */}
        <Mpg.Flex className="loop-wheel" borderRadius="50%" tight alignItems="center" justifyContent="center">
          <svg width={maxDiameter} height={maxDiameter}>

            {
              tracks.current.map((track, index) => {

                // const _current_measure_ = currentMeasure;
                // const _track_index_= index;
                // console.log(Object.keys(_current_measure_[_track_index_]).map(key => _current_measure_[_track_index_][key] ? '1' : '_').join(''));

                return <CircularTrack 
                  key={index} 
                  playbackRef={playbackRef.current} 
                  trackIndex={index} 
                  currentMeasure={currentMeasure[index]}
                  wheelRadius={maxRadius} 
                  outerRadius={maxRadius - trackWidth * index} 
                  width={trackWidth} 
                  track={track} />
              })
            }
          </svg>

          <Mpg.Flex 
            tight
            className="current-measure"
            justifyContent="center"
            alignItems="center"
            borderRadius="50%"
            width={maxRadius - trackWidth * 4}
            height={maxRadius - trackWidth * 4}
            fontSize={currentMeasureNumber === 0 ? '1rem' : '4rem'}>{currentMeasureNumber === 0 ? 'Press Play' : currentMeasureNumber}</Mpg.Flex>
        </Mpg.Flex>
      </Mpg.div> 

      
      
    



      
      
      <Mpg.Flex className="toolbar bottom" row justifyContent="center" alignItems="flex-start" wide absolute anchorBottom>


        {/* RESTART */}
        <Mpg.Tag as="button" className="transparent button" grow
          onClick={handlePlayStop} 
          padding={5}
          textAlign="center"
          borderRadius="50%"
          >
          {
            <Mpg.FontAwesomeIcon icon={'fast-backward'} size="2x"/>
          }
        </Mpg.Tag>


        {/* PREV */}
        <Mpg.Tag as="button" className="transparent button" grow
          onClick={handlePlayStop} 
          padding={5}
          textAlign="center"
          borderRadius="50%"
          >
          {
            <Mpg.FontAwesomeIcon icon={'angle-left'} size="2x"/>
          }
        </Mpg.Tag>
        
        {/* PLAY STOP BUTTON */}
        <Mpg.Tag as="button" className="transparent button" grow
          onClick={handlePlayStop} 
          padding={5}
          textAlign="center"
          borderRadius="50%"
          >
          {
            playButton
          }
        </Mpg.Tag>

        {/* NEXT */}
        <Mpg.Tag as="button" className="transparent button" grow
          onClick={handlePlayStop} 
          padding={5}
          textAlign="center"
          borderRadius="50%"
          >
          {
            <Mpg.FontAwesomeIcon icon={'angle-right'} size="2x"/>
          }
        </Mpg.Tag>

        {/* REPEAT TOGGLE */}
        <Mpg.Tag as="button" className="transparent button" grow
          onClick={handlePlayStop} 
          padding={5}
          textAlign="center"
          borderRadius="50%"
          >
          {
            <Mpg.div className="repeat-indicator">

              &#10227;
            </Mpg.div>
          }
        </Mpg.Tag>

      </Mpg.Flex>


     


      
    </Mpg.Flex>

  </>

}


