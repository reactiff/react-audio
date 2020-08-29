import React from 'react';
import {useRef, useState, useEffect} from 'react'
import uuid from 'uuid/v4'

import AudioGraph from '../webaudio/AudioGraph';
import Analyzer from '../webaudio/Analyzer';
import AudioSource from '../webaudio/AudioSource';
import Constant from '../webaudio/Constant';
import Delay from '../webaudio/Delay';
import DynamicCompressor from '../webaudio/DynamicCompressor';
import Feedback from '../webaudio/Feedback';
import Filter from '../webaudio/Filter';
import { FilterType } from '../webaudio/modules/FilterModule';
import Gain from '../webaudio/Gain';
import Instrument from '../webaudio/Instrument';
import Noise from '../webaudio/Noise';
import Oscillator from '../webaudio/Oscillator';
import Param from '../webaudio/Param';
import Slider from '../webaudio/Slider';
import Position from '../webaudio/Position';
import DeviceList from '../webaudio/DeviceList'
import StreamPlayer from '../webaudio/StreamPlayer'
import StreamRecorder from '../webaudio/StreamRecorder'
import Split from '../webaudio/Split';
import Stereo from '../webaudio/Stereo';
import Transport from '../webaudio/Transport';
import note from '../webaudio/modules/Notes';

import ui from '../mpg/Mpg'

import ActionBar from '../Synth/ActionBar'
import * as Actions from '../Synth/actions'
import generateOscillators from '../Synth/generateOscillators'

import '../css/synth.css'

export default () => {

  const [context, setContext] = useState();
  
  return (
    <div className="App flex-tight">
      <header className="App-header">

        <AudioGraph>

          
          <DeviceList />  


          {/* <TestVirtualCable /> */}

          {/* <Instrument name="PCRadio" > */}

            {/* <StreamPlayer>
              <Analyzer type="wave" margin={20} ></Analyzer>
            </StreamPlayer> */}

            
            
            {/* <Gain value={0.8}>
              <Oscillator type="sine"  />
            </Gain> */}


            {/* <Gain name="Inst">
              <Param name="gain">
                <Constant offset={1} />
              </Param>
              <Constant offset={1} />
              <Oscillator purpose="LFO" type="sine" frequency={2} duration={1}></Oscillator>
            </Gain> */}

        
            
            
            
            

            {/* <Gain value={1}>
              <Oscillator sine>
                <Param name="frequency" min={30} max={700} >
                  <Oscillator type="sine" frequency={2}></Oscillator>
                </Param>
              </Oscillator>
            </Gain> */}

            
           
            

          {/* </Instrument> */}


          {/* <Instrument name="Kick" binding="0" autoRelease duration={0.5} >
            <Gain value={1} targetValue={0.001} duration={0.5}>
              <Oscillator type="sine" duration={0.5}>
                <Param name="frequency" value={100} targetValue={0.001} duration={0.2} method={TransitionMethod.Exponential} ></Param>
              </Oscillator>
            </Gain>
            <Analyzer type="wave" width={120} height={300} sizeX={300} sizeY={120} rotate90></Analyzer>
            <Analyzer type="bar" width={120} height={120} ></Analyzer>
          </Instrument>
           */}

          {/* <Transport>

            <Instrument name="Bass" binding="b" frequency={40}>
                
              <Oscillator type="sine" frequency={80}/>
              
            </Instrument>

            <Instrument name="Kick" binding="0">
              <Gain value={1} targetValue={0.001} duration={0.5}>
                <Oscillator type="sine" duration={0.5}>
                  <Param name="frequency" value={150} targetValue={0.001} duration={0.5} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain>
              <Analyzer type="wave" width={120} height={300} sizeX={300} sizeY={120} rotate90></Analyzer>
              <Analyzer type="bar" width={120} height={120} ></Analyzer>
            </Instrument>


            <Instrument name="Clap" binding="2">
                <Filter type={FilterType.highpass} frequency={1000} Q={10}>
                  <Gain value={1} targetValue={0.00001} duration={0.5}>
                    <Noise duration={0.5} playbackRate={1}></Noise>
                  </Gain>
                </Filter>
              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
            </Instrument>   
            
          </Transport> */}

        </AudioGraph>

      </header>
    </div>
  );

};