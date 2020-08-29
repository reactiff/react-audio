import React from 'react';
import ui from '../mpg/Mpg'

import { AudioGraph } from '../webaudio';

import Oscillators from './Oscillators';
import Drums from './Drums';
import ParamAutomation from './ParamAutomation';

export default () => {

  return (
    <div className="App flex-tight">
      <header className="App-header">

        <AudioGraph>

          <div className="flex column" style={{width: '50vw'}}>
            <ui.Tabs activeKey="drums">
              {
                {
                  oscillators: () => <Oscillators />,
                  params: () => <ParamAutomation />,
                  drums: () => <Drums />,
                }
              }
            </ui.Tabs>
          </div>
          
          
          
           

            
            
            {/* <Gain value={0.8}>
              <Oscillator type="sine"  />
            </Gain> */}


            {/* <Gain name="Inst">
              <Param name="gain">
                <Constant offset={1} />
              </Param>
              <Constant offset={1} />
              <Oscillator purpose="LFO" type="sine" frequency={2} duration={1}></Oscillator>
            </Gain> */}

        
            
            
            
            

            {/* <Gain value={1}>
              <Oscillator sine>
                <Param name="frequency" min={30} max={700} >
                  <Oscillator type="sine" frequency={2}></Oscillator>
                </Param>
              </Oscillator>
            </Gain> */}

            
           
            



          {/* <Instrument name="Kick" binding="4" duration={3} >
            <Gain targetValue={0.00001} duration={1.5}>
              <Oscillator sine duration={2}>
                <Param name="frequency" value={100} targetValue={20} duration={2} method={TransitionMethod.Exponential} ></Param>
              </Oscillator>
            </Gain>
          </Instrument> */}
          

          {/* <Transport>

            <Instrument name="Bass" binding="b" frequency={40}>
                
              <Oscillator type="sine" frequency={80}/>
              
            </Instrument>

            <Instrument name="Kick" binding="0">
              <Gain value={1} targetValue={0.001} duration={0.5}>
                <Oscillator type="sine" duration={0.5}>
                  <Param name="frequency" value={150} targetValue={0.001} duration={0.5} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain>
              <Analyzer type="wave" width={120} height={300} sizeX={300} sizeY={120} rotate90></Analyzer>
              <Analyzer type="bar" width={120} height={120} ></Analyzer>
            </Instrument>


            <Instrument name="Clap" binding="2">
                <Filter type={FilterType.highpass} frequency={1000} Q={10}>
                  <Gain value={1} targetValue={0.00001} duration={0.5}>
                    <Noise duration={0.5} playbackRate={1}></Noise>
                  </Gain>
                </Filter>
              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
            </Instrument>   
            
          </Transport> */}

        </AudioGraph>

      </header>
    </div>
  );

};