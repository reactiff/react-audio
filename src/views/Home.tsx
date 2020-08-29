import React from 'react';
import {useRef, useState, useEffect} from 'react'
import uuid from 'uuid/v4'

import AudioContext from '../webaudio/AudioGraph';
import Analyzer from '../webaudio/Analyzer';
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
import Slider from '../webaudio/Slider';
import Position from '../webaudio/Position';
import StreamPlayer from '../webaudio/StreamPlayer'
import StreamRecorder from '../webaudio/StreamRecorder'
import Split from '../webaudio/Split';
import Stereo from '../webaudio/Stereo';
import Transport from '../webaudio/Transport';
import note from '../webaudio/modules/Notes';

import Mpg from '../mpg/Mpg'

import ActionBar from '../Synth/ActionBar'
import * as Actions from '../Synth/actions'
import generateOscillators from '../Synth/generateOscillators'

import '../css/synth.css'

declare var navigator: any | null; 

const A_FREQ = 440;
function midiNoteToFreq(note: number) {
  return (A_FREQ / 32) * (2 ** ((note - 9) / 12))
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

var noteRelease: any = {};

//Synth
export default (props: any) => {

  const instrument = useRef<any>()

  const getInstrument = () => instrument;

  // handlers
  const handleRegisterInstrument = (instance: any) => {
    instrument.current = instance;
  }

  function onMIDISuccess(midiAccess: any) {
    for (var input of midiAccess.inputs.values()){
      input.onmidimessage = getMIDIMessage;
      console.log('MIDI: ' + input.name + ' ' + input.state);
    }
  }

  const noteOn = async (note: number, velocity: number) => {
    const f = midiNoteToFreq(note);
    const v = velocity / 127;
    noteRelease[note] = await instrument.current.trigger({frequency: f, velocity: v});
  }

  const noteOff = async (note: number) => {
    if(noteRelease[note]){
      noteRelease[note]();
    }
  }
  
  function getMIDIMessage(message: any) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  
    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          noteOn(note, velocity);
        } else {
          noteOff(note);
        }
        break;
      case 128: // noteOff
        noteOff(note);
        break;
      default: 
        console.log(message.data);
        break;
    }
  }
  

  useEffect(()=>{
   
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
    } 

  },[]);

return <>

    {/* INSTRUMENT PANEL   */}
    <Mpg.div className="synth-instrument-panel scrollable vertical" translucent> 
        
      <AudioContext>

        <Instrument name="SynthLead"
          binding="midi" 
          registerInstrument={handleRegisterInstrument}
          > 

          {/* <Gain value={1} targetValue={0.001} duration={1}> */}
            <Oscillator type="sine">
              {/* <Param name="frequency" value={100} targetValue={0.001} duration={0.5} method={TransitionMethod.Exponential} ></Param> */}
            </Oscillator>
          {/* </Gain> */}
          
          {/* <Analyzer type="wave" width={200} height={200} color="yellow" rotate90/>   */}

        </Instrument>
        
        
      </AudioContext>
     
    </Mpg.div>
  </>;
};
