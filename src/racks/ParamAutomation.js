import React, { useState } from 'react';
import ag, { Analyzer, Constant } from '../webaudio';
import ui from '../mpg/Mpg'

export default () => {

  return <div className="flex column rack">
    
    <h4>Parameter Automation</h4>

    <ag.Instrument binding="0" name="Sine with offset">

      <ag.Gain value={1}>

        <ag.Oscillator inline upstream sine frequency={125}></ag.Oscillator>  
        {/* <ag.Constant inline offset={1}/>   */}

      </ag.Gain>
      
    

        

        {/* <ag.Oscillator purpose="Tone" sine>  

          

          

          <ag.Param purpose="FreqParam" name="frequency">
            
          </ag.Param>
          
        </ag.Oscillator> */}
      

      {/* ITS NOT MODULATING FREQUENCY */}
      {/* STEP THROUGH IT AND MAKE SURE THE FOLLOWING CONNECTIONS ARE MADE:
      
        1. LFO is connected TO FreqParam and stored as ep
        2. FreqParam ep is connected to A-rate frequence AudioParam of Sound Oscillator
        3. Sound ep to MASTER.
      
      */}

      <ag.Analyzer aspect={0.3}/>

    </ag.Instrument>
  </div>

};