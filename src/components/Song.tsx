import React from 'react';

import Knob from 'react-canvas-knob';
import AudioContext from './webaudio/AudioContext';
import Analyzer from './webaudio/Analyzer';
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
import Slider from './webaudio/Slider';
import {TransitionMethod} from './webaudio/modules/ParamModule';
import Position from './webaudio/Position';
import Recorder from './webaudio/Recorder'
import Split from './webaudio/Split';
import Stereo from './webaudio/Stereo';
import Transport from './webaudio/Transport';
import note from './webaudio/modules/Notes';

import './css/app.css';

export default () => {

  return (
    <div className="App">

      <header className="App-header">

        <AudioContext>

          <Transport>

              <Instrument name="Drums">

                  <Split >

                    <Split.Return>
                      <Stereo>
                        <Param name="pan">
                          <Oscillator type="sine">
                            <Slider targetParam="frequency" value={1.95 * 1} min={0} max={1.95*4} step={0.05}/>
                          </Oscillator>
                          <Analyzer type="wave" width={200} height={200} color="yellow" rotate90/>  
                        </Param>
                      
                        <Gain> 
                          <Slider targetParam="gain" value={1} min={0} max={10} step={0.1} vertical/>
                          <Filter type={FilterType.highpass} frequency={0} Q={1}>
                            <Slider targetParam="frequency" value={0} min={0} max={12000} step={1} />
                            <Slider targetParam="Q" value={1} min={0} max={1000} step={1} />
                            <Gain/> 
                          </Filter>
                      </Gain> 
                      
                      </Stereo>
                      
                    </Split.Return>

                    <Split.Return>
                      <Gain> 
                        <Slider targetParam="gain" value={1} min={0} max={10} step={0.1} vertical/>
                        
                         
                        <Filter type={FilterType.notch} Q={1}>
                          <Slider targetParam="frequency" value={100} min={0} max={12000} step={1} />

                          <Gain/> 

                        </Filter>
                      

                      </Gain> 
                    </Split.Return>
                    
                    <Split.Input>
                      <Delay delayTime={0.1}>
                        <AudioSource src="/audio/tomorrow/mp3/loops/drums.mp3"></AudioSource> 
                      </Delay>
                      
                    </Split.Input>

                  </Split> 



              </Instrument>      

            
          </Transport>


              
          

          

        </AudioContext>

      </header>
    </div>
  );
};


// DUMP

                      
