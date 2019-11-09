import React from 'react';

import AudioContext from './AudioContext'

import Analyzer from './Analyzer'
import AudioSource from './AudioSource'
import Constant from './Constant'
import Delay from './Delay';
import Filter from './Filter'
import { FilterType } from './classes/FilterModule';
import Gain from './Gain'
import Instrument from './Instrument';
import Oscillator from './Oscillator'
import Param from './Param'
import {TransitionMethod} from './classes/ParamModule';

import Split from './Split'

import note from './classes/Notes'

import './css/app.css';

export default () => {

  return (
    <div className="App">

      <header className="App-header">

        <AudioContext>

          <Instrument name="Kick">
            <Gain value={0.5} targetValue={0.00001} duration={1}>
              <Oscillator type="sine" frequency={120} duration={1}>
                <Param for="frequency" value={120} targetValue={0.0001} duration={0.3} method={TransitionMethod.Exponential} ></Param>
              </Oscillator>
            </Gain>
            <Analyzer type="wave" width={120} height={300} sizeX={300} sizeY={120} rotate90></Analyzer>
            <Analyzer type="bar" width={120} height={120} ></Analyzer>
          </Instrument>

          <Instrument name="Double Kick">
            <Gain value={0.5} targetValue={0.00001} duration={2}>
              
              <Oscillator type="sine" frequency={120} duration={1}>
                <Param for="frequency" value={120} targetValue={0.0001} duration={0.3} method={TransitionMethod.Exponential} ></Param>
              </Oscillator>

              <Delay delayTime={0.15}>
                <Oscillator type="sine" frequency={120} duration={1}>
                  <Param for="frequency" value={120} targetValue={0.0001} duration={0.3} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Delay>

            </Gain>
            <Analyzer type="wave" width={120} height={300} sizeX={300} sizeY={120} rotate90></Analyzer>
            <Analyzer type="bar" width={120} height={120} ></Analyzer>
          </Instrument>

          <Instrument name="Boing, poom chuck!">

            <Gain>

              <Split >

                <Split.Return>
                  <Gain value={0.5}>
                    <Analyzer type="wave" width={500} height={200}
                      // sizeX={200} 
                      // sizeY={100}
                      color="yellow"
                      onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                    />
                  </Gain>
                  <Gain value={1}> 
                    <Filter type={FilterType.bandpass} frequency={2000} Q={1}>
                      <Delay delayTime={2.22 / 8}></Delay>
                    </Filter>
                    <Analyzer type="wave" width={500} height={200}
                      // sizeX={200} 
                      // sizeY={100}
                      color="#8888ff"
                      onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                    />
                  </Gain>
                </Split.Return>

                <Split.Input>

                  <AudioSource src="/audio/musicnonstop.mp3"></AudioSource> 

                </Split.Input>

              </Split>

            </Gain>
           
            <Analyzer type="wave" width={500} height={200}
                    // sizeX={200} 
                    // sizeY={100}
                    onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                  />

            <Analyzer 
                    type="bar" 
                    width={500} 
                    height={100}
                  />

          </Instrument>          

          <Instrument name="Drone">

            <Gain value={0.1}>

              <Gain>

                <Oscillator type="sine" frequency={36.71} duration={60}></Oscillator>
                <Oscillator type="sine" frequency={41.20} duration={60}></Oscillator>
                
                <Param for="gain">
                  <Constant value={0.3}></Constant>
                  <Oscillator type="sine" frequency={1.8} duration={60}></Oscillator>
                </Param>

              </Gain>

            </Gain>
            
            
          </Instrument>

        </AudioContext>

      </header>

    </div>
  );

};
