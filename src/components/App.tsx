import React from 'react';

import AudioContext from './AudioContext'

import Analyzer from './Analyzer'
import AudioSource from './AudioSource'
import Constant from './Constant'
import Filter from './Filter'
import { FilterType } from './classes/FilterModule';
import Gain from './Gain'
import Instrument from './Instrument';
import Oscillator from './Oscillator'
import Param from './Param'

import Split from './Split'



import note from './classes/Notes'


import './css/app.css';
import Delay from './Delay';




export default () => {

  return (
    <div className="App">

      <header className="App-header">

        <AudioContext>

          {/* <Instrument name="Single">

            
            <Gain startValue={0.5} endValue={0.00001} duration={1}>
              
              <Oscillator type="sine" frequency={220} duration={1} />

            </Gain>


            <Analyzer type="wave" ></Analyzer>
            <Analyzer type="bar" ></Analyzer>
            
          </Instrument> */}

          {/* <Instrument name="Double">
            <Gain startValue={1} endValue={0.001} duration={2}>
              <Oscillator type="sine" frequency={220} duration={1} />
              <Oscillator type="sine" frequency={440} duration={1} />
            </Gain>


          </Instrument>

          <Instrument name="Triple">
            
            <Gain startValue={1} endValue={0.001} duration={2}>

              <Oscillator type="sine" frequency={440 / 2} duration={1} />
              <Oscillator type="sine" frequency={440} duration={1} />
              <Oscillator type="sine" frequency={440 * 16} duration={1} />
              
              
              
            </Gain>
            
          </Instrument> */}

          <Instrument name="Mp3 Player">

            <Gain>

              {/* <Filter type={FilterType.bandpass} frequency={500} Q={1}> 
                <AudioSource src="/audio/musicnonstop.mp3"></AudioSource> 
              </Filter> */}
            
              {/* <Gain startValue={0.5}>
                <Oscillator type="sine" frequency={1} duration={60}></Oscillator>
                <Analyzer 
                    type="wave" 
                    width={500} 
                    height={500}
                    rotate90
                    trace
                    sizeX={500} 
                    sizeY={250}
                    onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                  />
              </Gain>

              <Gain startValue={0.5}>
                <Delay delayTime={0.25}>
                  <Oscillator type="sine" frequency={1} duration={60}></Oscillator>
                </Delay>
                <Analyzer 
                    type="wave" 
                    width={500} 
                    height={500}
                    rotate90
                    trace
                    sizeX={500} 
                    sizeY={250}
                    onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                  />
              </Gain> */}

              

              <Split >

                <Split.Return>
 
                  <Gain value={0.5}/>
                                                                      
                  <Gain value={1}> 
                    <Filter type={FilterType.bandpass} frequency={1000} Q={5}>
                      <Delay delayTime={0.1}></Delay>
                    </Filter>
                  </Gain>
                  
                  {/* <Gain value={1}> 
                    <Filter type={FilterType.highpass} frequency={1000}>
                      <Delay delayTime={0.45}/>
                    </Filter>
                 </Gain>
                  
                  <Gain value={1}> 
                    <Filter type={FilterType.highpass} frequency={2000}>
                      <Delay delayTime={0.9}/>
                    </Filter>
                  </Gain>
                  
                  <Gain value={1}> 
                    <Filter type={FilterType.highpass} frequency={4000}>
                      <Delay delayTime={1.8}/>
                    </Filter>
                  </Gain> */}

                </Split.Return>

                <Split.Input>

                  <AudioSource src="/audio/musicnonstop.mp3"></AudioSource> 

                </Split.Input>

              </Split>




              {/* <Gain startValue={0.001}>

                <Gain>

                  <Oscillator type="sine" frequency={36.71} duration={60}></Oscillator>
                  <Oscillator type="sine" frequency={41.20} duration={60}></Oscillator>
                  
                  <Param for="gain">
                    <Constant value={0.3}></Constant>
                    <Oscillator type="sine" frequency={1.8} duration={60}></Oscillator>
                  </Param>

                </Gain>
              
              </Gain> */}


              

            
            </Gain>
           
            <Analyzer 
                    type="wave" 
                    width={500} 
                    height={500}
                    rotate90
                    trace
                    sizeX={500} 
                    sizeY={250}
                    onClick={(analyzer: any)=>{ analyzer.toggleAnimation() }} 
                  />

          </Instrument>          

          

        </AudioContext>

      </header>

    </div>
  );

};
