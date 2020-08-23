import React from 'react';
import {useRef, useState, useEffect} from 'react'
import uuid from 'uuid/v4'

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
import StreamPlayer from './webaudio/StreamPlayer'
import StreamRecorder from './webaudio/StreamRecorder'
import Split from './webaudio/Split';
import Stereo from './webaudio/Stereo';
import Transport from './webaudio/Transport';
import note from './webaudio/modules/Notes';

import Mpg from './mpg/Mpg'

import ActionBar from './Synth/ActionBar'
import * as Actions from './Synth/actions'
import generateOscillators from './Synth/generateOscillators'
import renderChildren from './webaudio/renderChildren'

import './css/synth.css'

//Synth
export default (props: any) => {

  const [instrumentId, setInstrumentId] = useState<any>(null)
  const [instrument, setInstrument] = useState<any>(null)
  const [oscillators, setOscillators] = useState<any[]>([])

  const scope: any = {}

  // handlers
  const handleRegisterInstrument = (instance: any) => {
    setInstrument(instance);

    setTimeout(()=>{
      instance.trigger();
    },100)
    
  }

  const handleGenerate = async () => {

    const options = {
        type: 'sine',
        gain: 0.55,
        harmonicOrdinals: [],
        useIntegers: true,
        usePrimes: false,
        distributionCurve: 'linear',
        count: [2, 7], 
        range: [40, 800]
    }

    const oscillators = await generateOscillators(options)
    setGeneratedResult(oscillators)

  }

  const setGeneratedResult = (newOscillators: any) => {

    let newArray = [];
    for(let old of oscillators){
      if(old.hold){
        newArray.push(old);
      }
    }
    
    newArray = newArray.concat(newOscillators)

    setOscillators(newArray)

    //set new instrument id
    const newId = uuid()
    setInstrumentId(newId)

  }

  useEffect(()=> {
    handleGenerate();
  }, [])
  
  return <>

    {/* INSTRUMENT PANEL   */}
    <Mpg.div className="synth-instrument-panel scrollable vertical" translucent> 
        
      <AudioContext>

        <Instrument name="Random Instrument" id={instrumentId}
          binding="p" 
          autoRelease 
          duration={10} 
          // signalSource={{ function: 'primes', options: { count: [3, 20], range: [40, 1000] }}}
          registerInstrument={handleRegisterInstrument}
          > 

          {
            instrument &&
            renderChildren(oscillators.map((osc, index) => {

              return <Gain key={index} value={osc.gain} targetValue={0.0001} duration={10}>
                  <Oscillator type={osc.type} frequency={osc.frequency} prime={osc.prime}/>
              </Gain>  

            }), {
              context: props.context,
              target: instrument
            })  
          }

          {/* <Analyzer type="wave" width={200} height={200} color="yellow" rotate90/>   */}

        </Instrument>
        
        
      </AudioContext>
     
    </Mpg.div>

    
    <ActionBar
    
      prev={() => Actions.handlePrev(scope)}
      next={() => Actions.handleNext(scope)}

      generate={handleGenerate}
      trigger={() => instrument.trigger()}
      settings={() => Actions.handleSettings(scope)}
      save={() => Actions.handleSave(scope)}

    />

  </>;

};
