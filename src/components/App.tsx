import React from 'react';

import AudioContext from './AudioContext'

import Instrument from './Instrument';
import Gain from './Gain'
import Oscillator from './Oscillator'
import Analyzer from './Analyzer'



import './css/app.css';


export default () => {

  return (
    <div className="App">

      <header className="App-header">

        <AudioContext>

          {/* <audio
              controls
              src="/audio/musicnonstop.mp3">
                  Your browser does not support the
                  <code>audio</code> element.
          </audio> */}

          <Instrument>
            <Analyzer type="wave" >
              <Gain startValue={1} endValue={0.001} duration={2}>
                <Oscillator type="sine" frequency={220} duration={1} />
                {/* <Oscillator type="sine" frequency={438} duration={1} /> */}
              </Gain>
            </Analyzer>
          </Instrument>

          <Instrument>
            <Analyzer type="wave" >
              <Gain startValue={1} endValue={0.001} duration={2}>
                <Oscillator type="sine" frequency={220} duration={1} />
                <Oscillator type="sine" frequency={440} duration={1} />
              </Gain>
            </Analyzer>
          </Instrument>

          <Instrument>
            <Analyzer type="bar">
              <Gain startValue={1} endValue={0.001} duration={2}>

                <Oscillator type="sine" frequency={440 / 2} duration={1} />
                
                <Oscillator type="sine" frequency={440} duration={1} />

                <Oscillator type="sine" frequency={440 * 2} duration={1} />

                <Oscillator type="sine" frequency={440 * 4} duration={1} />

                <Oscillator type="sine" frequency={440 * 8} duration={1} />

                <Oscillator type="sine" frequency={440 * 16} duration={1} />

                <Oscillator type="sine" frequency={440 * 32} duration={1} />
                
                {/* <Gain startValue={0.001} endValue={1000000} duration={2}>
                  <Oscillator type="sine" frequency={880} duration={1} />
                </Gain>
                */}
                
              </Gain>
            </Analyzer>
          </Instrument>
          
        </AudioContext>

      </header>

    </div>
  );

};
