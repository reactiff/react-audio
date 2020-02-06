import React, { useRef } from 'react'
import {useState, useEffect, useMemo} from 'react'
import uuid from 'uuid/v4'

import Mpg from '../mpg/Mpg'
import './loops.css'
import { useWindowSize } from '../../hooks/Hooks'

import CircularTrack from './CircularTrack'
import Playback from './Playback'

import Analyzer from '../webaudio/Analyzer';
import AudioContext from '../webaudio/AudioContext';
import AudioSource from '../webaudio/AudioSource';
import Constant from '../webaudio/Constant';
import Delay from '../webaudio/Delay';
import Feedback from '../webaudio/Feedback';
import Filter from '../webaudio/Filter';
import { FilterType } from '../webaudio/modules/FilterModule';
import Gain from '../webaudio/Gain';
import Instrument from '../webaudio/Instrument';
import Noise from '../webaudio/Noise';
import Oscillator from '../webaudio/Oscillator';
import Param from '../webaudio/Param';
import Position from '../webaudio/Position';
import Recorder from '../webaudio/Recorder'
import Slider from '../webaudio/Slider';
import Split from '../webaudio/Split';
import Stereo from '../webaudio/Stereo';
import {TransitionMethod} from '../webaudio/modules/ParamModule';
import Inline from '../../shared/Inline'

import ProjectSettings from './ProjectSettings'

const inputArray = [
  '1000000000000000',
]

const staticProjectData = {

  name: 'Untitled Project',
  tempo: 120,
  bars: 4,

  tracks: [

    { id: "kick1", name: 'Track 0', beats: 16, measures: {}, foundation: true },

    // { beats: 16, measures: {}},
    // { beats: 16, measures: {}},
    
  ], 

  instruments: [],

};

export default (props: any) => {

  const project = useRef<any>({ tracks: [] });
  const [projectRevision, setProjectRevision] = useState(0);
  
  const [playbackState, setPlaybackState] = useState(0)
  
  const [bpm, setBpm] = useState(100)
    
  const [currentMeasureNumber, setCurrentMeasureNumber] = useState(0)
  
  const windowSize = useWindowSize()
  const maxDiameter = Math.min(windowSize.width, windowSize.height - 55 - 30)
  const maxRadius = maxDiameter / 2 
  const trackWidth = Math.min((maxRadius - 60) / (project.current.tracks.length ), 60);
  

  // handlers
  const handleMeasureNumberChange = (measureNumber: number) => {
    setCurrentMeasureNumber(measureNumber);
  }
  const handlePlayStop = () => {
    playbackRef.current.trigger();
  }
  const handleRegisterInstrument = (inst: any) => {
    
    project.current.instruments.push(inst);

    const track = project.current.tracks.find((tr: any) => tr.instrumentId === inst.$params.trackName)
    if(track){
      track.instrument = inst;
    }
  }

  const playbackRef = useRef<any>(new Playback());
  project.current = React.useMemo(()=>{
    return staticProjectData;
  },[]);


  project.current.onChange = () => {
    setProjectRevision(r => r + 1);
  };

  useEffect(()=>{

    //playback component
    playbackRef.current.subscribe('onStateChange', setPlaybackState);
    playbackRef.current.subscribe('onMeasureNumberChange', handleMeasureNumberChange);
    playbackRef.current.setProject(project);

  },[]);
  
  //memoized
  const playButton = useMemo(() => {
    let icon = Inline.switch(playbackState, 'play', 1, 'stop', 2, 'play-circle')
    return <Mpg.FontAwesomeIcon icon={icon} size="2x"/>
  }, [playbackState])

  return <>

    <Mpg.Flex className="loop-panel" translucent tight alignItems="center" justifyContent="center" noMargin column>  

      <Mpg.div style={{display: 'none'}}>

        <AudioContext>

          <Instrument name="Kick 1" trackName="kick1" registerInstrument={handleRegisterInstrument}> 
            <Gain value={1} targetValue={0.001} duration={0.35}>
              <Oscillator type="sine" duration={0.4} frequency={100}>
                <Param name="frequency" targetValue={0.001} ></Param>
              </Oscillator>
            </Gain>
          </Instrument>
          <Instrument name="Kick 2" trackName="kick2" registerInstrument={handleRegisterInstrument}> 
            <Gain value={1} targetValue={0.001} duration={0.2}>
              <Oscillator type="sine" duration={0.2} frequency={100}>
                <Param name="frequency" targetValue={0.001} ></Param>
              </Oscillator>
            </Gain>
          </Instrument>

          <Instrument name="Snare 1" trackName="snare1" registerInstrument={handleRegisterInstrument}>
              <Gain value={1} targetValue={0.001} duration={0.2}>
                <Oscillator type="sine" duration={0.2} frequency={400}>
                  <Param name="frequency" targetValue={0.1} ></Param>
                </Oscillator>
              </Gain>
          </Instrument>
          <Instrument name="Snare 2" trackName="snare2" registerInstrument={handleRegisterInstrument}>
              <Gain value={1} targetValue={0.001} duration={0.1}>
                <Oscillator type="sine" duration={0.15} frequency={200}>
                  <Param name="frequency" targetValue={0.1} ></Param>
                </Oscillator>
              </Gain>
          </Instrument>


          <Instrument name="HiHat 1" trackName="hihat1" registerInstrument={handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.5} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={-0.5}>
                    <Noise duration={0.1} playbackRate={1.5} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>

          <Instrument name="HiHat 2" trackName="hihat2"  registerInstrument={handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.1} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={0.5}>
                    <Noise duration={0.1} playbackRate={1} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>

          <Instrument name="HiHat 3"  trackName="hihat3" registerInstrument={handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.3} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={0.1}>
                    <Noise duration={0.1} playbackRate={1.5} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>
          
          {/* <Instrument name="Clap" registerInstrument={handleRegisterInstrument}>
            <Filter type={FilterType.highpass} frequency={1000} Q={10}>
              <Gain value={0.3} targetValue={0.00001} duration={0.5}>
                <Noise duration={0.3} playbackRate={2}></Noise>
              </Gain>
            </Filter>
          </Instrument> */}

          

        </AudioContext>

      </Mpg.div>


      <Mpg.Flex className="toolbar top" row justifyContent="center" alignItems="center" wide absolute anchorTop padding={20}>

        <Mpg.div width={40}>
          &nbsp;
        </Mpg.div>

        <Mpg.div grow>
          &nbsp;
        </Mpg.div>

        <Mpg.div>
          <Mpg.Flex bgColor="black" width={50} height={50} round justifyContent="center" alignItems="center">
            {project.current.tempo}
          </Mpg.Flex>
        </Mpg.div>

        <Mpg.div grow>
          &nbsp;
        </Mpg.div>

        <Mpg.div>
          <Mpg.Disclosure width={40}>
            <ProjectSettings project={project.current} />
          </Mpg.Disclosure>
        </Mpg.div>

      </Mpg.Flex>

      <Mpg.div className="loop-wheel-container" width={maxDiameter} height={maxDiameter}>
        {/* LOOP WHEEL */}
        <Mpg.Flex className="loop-wheel" borderRadius="50%" tight alignItems="center" justifyContent="center">
          <svg width={maxDiameter} height={maxDiameter}>

            {
              project.current.tracks.map((track: any, index: number) => {

                // const _current_measure_ = currentMeasure;
                // const _track_index_= index;
                // console.log(Object.keys(_current_measure_[_track_index_]).map(key => _current_measure_[_track_index_][key] ? '1' : '_').join(''));

                return <CircularTrack 
                  key={index} 
                  playbackRef={playbackRef.current} 
                  trackIndex={index} 
                  // currentMeasure={currentMeasure[index]}
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


