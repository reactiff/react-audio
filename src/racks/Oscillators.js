import React, { useState } from 'react';
import ag from '../webaudio';
import ui from '../mpg/Mpg'

export default () => {
  
  return <div className="flex column rack">

      <h4>Oscillators</h4>
      
      <ag.Instrument name="Sine wave" adsr={{r:0}} binding="0">
        <ag.Oscillator sine> 
          <ag.Analyzer />
        </ag.Oscillator>
      </ag.Instrument>
      <ag.Instrument name="Square wave" adsr={{r:0.1}} binding="1">
      <ag.Oscillator square> 
          <ag.Analyzer />
        </ag.Oscillator>
      </ag.Instrument>
      <ag.Instrument name="Triangle wave" adsr={{r:0.1}} binding="2">
      <ag.Oscillator triangle> 
          <ag.Analyzer />
        </ag.Oscillator>
      </ag.Instrument>
      <ag.Instrument name="Sawtooth wave" adsr={{a: 0, d: 0, s: 0.8, r:0.5}} binding="3">
        <ag.Oscillator sawtooth> 
          <ag.Analyzer />
        </ag.Oscillator>
      </ag.Instrument>

    </div> 


};