import React from 'react';

import Mpg from '../mpg/Mpg';

import Analyzer from '../webaudio/Analyzer';
import AudioContext from '../webaudio/AudioGraph';
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
import StreamPlayer from '../webaudio/StreamPlayer'
import StreamRecorder from '../webaudio/StreamRecorder'
import Slider from '../webaudio/Slider';
import Split from '../webaudio/Split';
import Stereo from '../webaudio/Stereo';

export default (props: any) => (

    <Mpg.div style={{display: 'none'}}>
        <AudioContext>
          <Instrument name="Kick 1" registerInstrument={props.handleRegisterInstrument}> 
            <Gain value={1} targetValue={0.001} duration={0.35}>
              <Oscillator type="sine" duration={0.4} frequency={100}>
                <Param name="frequency" targetValue={0.001} ></Param>
              </Oscillator>
            </Gain>
          </Instrument>
          <Instrument name="Kick 2" registerInstrument={props.handleRegisterInstrument}> 
            <Gain value={1} targetValue={0.001} duration={0.2}>
              <Oscillator type="sine" duration={0.2} frequency={100}>
                <Param name="frequency" targetValue={0.001} ></Param>
              </Oscillator>
            </Gain>
          </Instrument>
          <Instrument name="Snare 1" registerInstrument={props.handleRegisterInstrument}>
              <Gain value={1} targetValue={0.001} duration={0.2}>
                <Oscillator type="sine" duration={0.2} frequency={400}>
                  <Param name="frequency" targetValue={0.1} ></Param>
                </Oscillator>
              </Gain>
          </Instrument>
          <Instrument name="Snare 2" registerInstrument={props.handleRegisterInstrument}>
              <Gain value={1} targetValue={0.001} duration={0.1}>
                <Oscillator type="sine" duration={0.15} frequency={200}>
                  <Param name="frequency" targetValue={0.1} ></Param>
                </Oscillator>
              </Gain>
          </Instrument>
          <Instrument name="HiHat 1" registerInstrument={props.handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.5} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={-0.5}>
                    <Noise duration={0.1} playbackRate={1.5} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>
          <Instrument name="HiHat 2" registerInstrument={props.handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.1} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={0.5}>
                    <Noise duration={0.1} playbackRate={1} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>
          <Instrument name="HiHat 3" registerInstrument={props.handleRegisterInstrument}>
              <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                <Gain value={0.3} targetValue={0.00001} duration={0.1}>
                  <Stereo pan={0.1}>
                    <Noise duration={0.1} playbackRate={1.5} />
                  </Stereo>
                </Gain>
              </Filter>
          </Instrument>
          <Instrument name="Clap" registerInstrument={props.handleRegisterInstrument}>
            <Filter type={FilterType.highpass} frequency={1000} Q={10}>
              <Gain value={0.3} targetValue={0.00001} duration={0.5}>
                <Noise duration={0.3} playbackRate={2}></Noise>
              </Gain>
            </Filter>
          </Instrument>
        </AudioContext>
    </Mpg.div>
);