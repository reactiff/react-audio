import React, { useState } from 'react';
import ag from '../webaudio';
import ui from '../mpg/Mpg'

export default () => {

  const [context, setContext] = useState();
  
  return <div className="flex column">
    <h4>Oscillators</h4>
    <ag.Instrument name="Sine wave" adsr={{r:0.1}} binding="0">
      <ag.Oscillator sine />
    </ag.Instrument>
    <ag.Instrument name="Square wave" adsr={{r:0.1}} binding="1">
      <ag.Oscillator square />
    </ag.Instrument>
    <ag.Instrument name="Triangle wave" adsr={{r:0.1}} binding="2">
      <ag.Oscillator triangle />
    </ag.Instrument>
    <ag.Instrument name="Sawtooth wave" adsr={{r:0.1}} binding="3">
      <ag.Oscillator sawtooth />
    </ag.Instrument>
  </div> 

};