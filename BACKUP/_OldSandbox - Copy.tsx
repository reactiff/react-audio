import React from 'react';

import Mpg from './mpg/Mpg';
// import Synth from './components/Synth';

import './css/app.css';

export default () => {

  return (
    <div className="App">

      <header className="App-header">

        <AudioContext>

          <Transport>

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
              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>>
            </Instrument>

            <Instrument name="Snare" binding="1">

              
                {/* <Gain value={0.1} targetValue={0.001} duration={0.2}>
                  <Noise duration={0.2} playbackRate={1}></Noise>
                </Gain> */}
              
              
                <Gain value={1} targetValue={0.001} duration={0.2}>
                  <Oscillator type="sine" duration={0.2}>
                    <Param name="frequency" value={400} targetValue={1} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                  </Oscillator>
                </Gain>


                <Gain value={0.2} targetValue={0.001} duration={0.1}>
                  <Oscillator type="square" duration={0.2}>
                    <Param name="frequency" value={2000} targetValue={0.001} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                  </Oscillator>
                </Gain>
              

              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>>
            </Instrument>

            <Instrument name="HiHat" binding="3">
              {/* <Filter type={FilterType.lowpass} frequency={11000} Q={1}> */}
                <Filter type={FilterType.highpass} frequency={12000} Q={10}>
                  <Gain value={0.25} targetValue={0.00001} duration={0.1}>
                    <Noise duration={1} playbackRate={0.5}>
                    </Noise>
                  </Gain>
                  <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
                </Filter>
              {/* </Filter> */}
              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>>
            </Instrument>

          </Transport>

          

          
          
          
          
          
          
                    
          <Instrument name="Feedback">
            <Feedback>

              <Delay delayTime={0.4}>
                <Gain value={0.5}>
                  <Filter type={FilterType.bandpass} frequency={432} Q={1}> 
                    <Feedback.Return/>
                  </Filter> 
                </Gain>
              </Delay>


              {/* <Gain value={1} targetValue={0.001} duration={0.2}>
                <Oscillator type="sine" duration={0.2}>
                  <Param name="frequency" value={400} targetValue={1} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain>
              <Gain value={0.2} targetValue={0.001} duration={0.1}>
                <Oscillator type="square" duration={0.2}>
                  <Param name="frequency" value={2000} targetValue={0.001} duration={0.1} method={TransitionMethod.Exponential} ></Param>
                </Oscillator>
              </Gain> */}
            


              <Gain value={1} targetValue={0.0001} delay={0} duration={2}>

                <Oscillator type="sawtooth" frequency={150} duration={2}></Oscillator>

                <Stereo>
                  <Param name="pan">
                    <Oscillator type="sine" frequency={2} duration={2}></Oscillator>
                  </Param>
                  <Oscillator type="sawtooth" frequency={151} duration={2}></Oscillator>
                </Stereo>
                
              </Gain>  


            </Feedback>
            <Analyzer type="wave" width={500} height={150} color="yellow"/>  
          </Instrument>


          {/* 
          
          
          PHASER

          

          
          FEEDBACK RETURN

          
          
          
          

          */}




















          {/* <Instrument name="Weird pulsating low drone">
            <Gain value={0.1}>

              <Gain>

                <Oscillator type="sine" frequency={36.71} duration={60}></Oscillator>
                <Oscillator type="sine" frequency={41.20} duration={60}></Oscillator>
                
                <Param name="gain">
                  <Constant value={0.3}></Constant>
                  <Oscillator type="sine" frequency={1.8} duration={60}></Oscillator>
                </Param>

              </Gain>

            </Gain>

          </Instrument> */}

          {/* <Instrument name="Recorder, Glass Rim, Desert wind @500">
            <Filter type={FilterType.bandpass} frequency={800} Q={1000}  >
              <Gain value={1}>
                <Stereo pan={1}>
                  <Noise playbackRate={0.1}>
                    <Analyzer type="wave" width={300} height={150} sizeX={300} sizeY={150} ></Analyzer>>        
                  </Noise>
                </Stereo>
                <Stereo pan={-1}>
                  <Noise playbackRate={0.1}>
                    <Analyzer type="wave" width={300} height={150} sizeX={300} sizeY={150} ></Analyzer>>        
                  </Noise>
                </Stereo>
              </Gain>
            </Filter> 
          </Instrument> */}
          



          {/* <Instrument name="Horse hooves">
            <Filter type={FilterType.lowpass} frequency={1001} Q={10}>
              <Filter type={FilterType.highpass} frequency={1000} Q={10}>
                <Gain value={1} targetValue={0.00001} duration={0.5}>
                  <Noise duration={0.5} playbackRate={1}>
                  </Noise>
                </Gain>
                <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>
              </Filter>
            </Filter>
            <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150} rotate90></Analyzer>>
          </Instrument> */}


          {/* <Instrument name="Drone">
            
            <Stereo>
              
              <Param name="pan">

                <Gain value={0.5}>
                  <Oscillator type="sine" frequency={5}></Oscillator>
                </Gain>
                

              </Param>

              <Oscillator id="sin" type="sine" frequency={60}>
                <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150}></Analyzer>
              </Oscillator>
              <Oscillator id="cos" type="sine" frequency={68}>
                <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150}></Analyzer>
              </Oscillator>


              <Analyzer type="scatter" x="sin" y="cos" width={300} height={300} sizeX={300} sizeY={100} traces color="rgba(255,255,0,1)"/>  

            </Stereo>

            


            <Oscillator id="cos" type="cosine" frequency={40} wave={[[0, 1],[0, 0]]}>
              <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150}></Analyzer>
            </Oscillator>
            
            
          </Instrument> */}

          {/* <Instrument name="Snare">

            
              <Filter type={FilterType.bandpass} frequency={500} Q={1000}  >
                <Gain value={1}>
                  <Stereo pan={1}>
                    <Noise playbackRate={0.5}>
                      <Analyzer type="wave" width={300} height={150} sizeX={300} sizeY={150} ></Analyzer>>        
                    </Noise>
                  </Stereo>
                  <Stereo pan={-1}>
                    <Noise playbackRate={0.1}>
                      <Analyzer type="wave" width={300} height={150} sizeX={300} sizeY={150} ></Analyzer>>        
                    </Noise>
                  </Stereo>
                </Gain>
              </Filter> 
            
            

            <Gain value={1} targetValue={0.00001} duration={0.2}>
              <Oscillator type="triangle" frequency={250} duration={0.5}>
                <Param name="frequency" value={500} targetValue={0.01} duration={0.2} method={TransitionMethod.Exponential} ></Param>
                <Analyzer type="wave" width={300} height={300} sizeX={300} sizeY={150}></Analyzer>
              </Oscillator>
            </Gain>
            
          </Instrument> */}

{/* 
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
            
            
          </Instrument> */}

        </AudioContext>

      </header>

    </div>
  );

};
