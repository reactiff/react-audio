import React, { useState } from 'react';
import { Instrument, Gain, Oscillator, Param, Analyzer, Filter, Noise, FilterType, Constant } from '../webaudio';
import ui from '../mpg/Mpg'


export default () => {

  const DURATION = 0.1;

return <div className="flex column rack">

    <h2>Tone with offset</h2>
    <Instrument tag="instrument" name="Tone with offset" adsr={{a: 0, d: 0, s: 0.8, r: 0.1}} binding="0"> 


      <Oscillator tag="TONE" sine>
        <Param tag="ToneFrequency" name="frequency">

          <Gain value={'0.5 * f'} targetValue={'0.5 * f * 2'} duration={DURATION} method="exp">

            <Oscillator tag="LFO" sine frequency={3}>
              <Constant offset={0.5}/>

              {/* <Param tag="LFOFrequency" name="frequency">
                <Gain value={0.5 * 5}>
                  <Oscillator tag="LFO2" sine frequency={2}>
                    <Constant offset={1.00}/>
                  </Oscillator>
                </Gain>
              </Param> */}

            </Oscillator>

            <Oscillator tag="LFO" sawtooth frequency={4}>
              {/* <Constant offset={0.5}/> */}

              {/* <Param tag="LFOFrequency" name="frequency">
                <Gain value={0.5 * 5}>
                  <Oscillator tag="LFO2" sine frequency={2}>
                    <Constant offset={1.00}/>
                  </Oscillator>
                </Gain>
              </Param> */}

            </Oscillator>

          </Gain>

        </Param>
      </Oscillator>

      

      
      
    </Instrument>
   
    <Analyzer tag="analyzer" type="wave" aspect={0.3} ></Analyzer>

  </div>;

  return <div className="flex column rack">

      <h4>Oscillators</h4>
       
      <Instrument tag="instrument" name="Kick" binding="0" autoRelease duration={DURATION}> 
        <Gain tag="gain" value={1.2} targetValue={0.001} duration={DURATION} method="exp">
          <Oscillator tag="oscillator1" sine>
            <Param name="frequency" value={80} targetValue={0.001} duration={DURATION} method="exp"/>
          </Oscillator>
        </Gain>
        <Analyzer tag="analyzer" type="wave" aspect={0.3} ></Analyzer>
      </Instrument>


      <Instrument name="Clap" binding="2" autoRelease>
          <Filter type={FilterType.highpass} frequency={1000} Q={10}>
            <Gain value={1} targetValue={0.00001} duration={0.5}>
              <Noise duration={0.5} playbackRate={1}></Noise>
            </Gain>
          </Filter>
        <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150}></Analyzer>
      </Instrument>

      <Instrument name="Snare" binding="1" autoRelease>

        
          {/* <Gain value={0.1} targetValue={0.001} duration={0.2}>
            <Noise duration={0.2} playbackRate={1}></Noise>
          </Gain> */}
        
        
          <Gain value={1} targetValue={0.001} duration={0.2}>
            <Oscillator type="sine" duration={0.2}>
              <Param name="frequency" value={400} targetValue={1} duration={0.1} method="exp" ></Param>
            </Oscillator>
          </Gain>


          <Gain value={0.2} targetValue={0.001} duration={0.1}>
            <Oscillator type="square" duration={0.2}>
              <Param name="frequency" value={2000} targetValue={0.001} duration={0.1} method="exp" ></Param>
            </Oscillator>
          </Gain>
        

        <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
      </Instrument>

      <Instrument name="HiHat" binding="3" autoRelease>
        {/* <Filter type={FilterType.lowpass} frequency={11000} Q={1}> */}
          <Filter type={FilterType.highpass} frequency={12000} Q={10}>
            <Gain value={0.25} targetValue={0.00001} duration={0.1}>
              <Noise duration={1} playbackRate={0.5}>
              </Noise>
            </Gain>
            <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
          </Filter>
        {/* </Filter> */}
        <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
      </Instrument>

    </div> 


};