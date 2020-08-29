import React from 'react';

import AudioContext from '../webaudio/AudioGraph';
import Analyzer from '../webaudio/Analyzer';
import AudioSource from '../webaudio/AudioSource';
import Constant from '../webaudio/Constant';
import Delay from '../webaudio/Delay';
import Feedback from '../webaudio/Feedback';
import Filter from '../webaudio/Filter';
import { FilterType } from '../webaudio/modules/FilterModule';
import Gain from '../webaudio/Gain';
import Instrument from '../webaudio/Instrument';
import Noise from '../webaudio/Noise';
import Oscillator from '../webaudio/Oscillator';
import Param from '../webaudio/Param';
import Slider from '../webaudio/Slider';
import TransitionMethod from '../webaudio/modules/TransitionMethod';
import Position from '../webaudio/Position';
import StreamPlayer from '../webaudio/StreamPlayer'
import StreamRecorder from '../webaudio/StreamRecorder'
import Split from '../webaudio/Split';
import Stereo from '../webaudio/Stereo';
import Transport from '../webaudio/Transport';
import note from '../webaudio/modules/Notes';

import '../App/app.css';

export default () => {
  return (
    <div className="App">
      <header className="App-header">



        <AudioContext>

            

          <Transport>



            <Instrument name="Random Primes" binding="r" autoRelease duration={5} signalSource={{ function: 'primes', options: { count: [3, 20], range: [40, 1000] }}}  > 
              <Gain value={1} targetValue={0.0001} duration={2}>
                  <Oscillator type="sine"/>
              </Gain>      
            </Instrument>

            <Instrument name="Freq Array" binding="1" autoRelease duration={5}  > 
              <Gain value={1} targetValue={0.0001} duration={5}>
                  <Oscillator type="sine" frequency={[237, 321, 405, 489, 573]} />
              </Gain>      
            </Instrument>

            <Instrument name="Glass Piano" binding="2" autoRelease duration={5}  > 
              <Gain value={1} targetValue={0.0001} duration={5}>
                  <Oscillator type="sine" frequency={[229, 339, 449, 561, 671]} />
              </Gain>      
            </Instrument>

            <Instrument name="Tambourine & Bell " binding="3" autoRelease duration={5}  > 
              <Gain value={1} targetValue={0.0001} duration={5}>
                  <Oscillator type="sine" frequency={[111, 203, 2933]} />
              </Gain>      
            </Instrument>                       
                      

            <Instrument name="Huge Bell" binding="0" autoRelease duration={120}  > 

              <Gain>
                <Stereo>
                  <Oscillator type="sine" frequency={[47, 47.1]} />
                  <Param name="pan">
                    <Oscillator type="sine" frequency={0.1}></Oscillator>
                  </Param>
                </Stereo>

                <Param name="gain" value={0.5} targetValue={0.001} duration={120} method="exp" ></Param>

              </Gain>      
              

              <Gain>
                  <Oscillator type="sine" frequency={[53, 53.14, 131, 131.14, 131.10]} />
                  <Param name="gain" value={0.5} targetValue={0.001} duration={110} method="exp" ></Param>
              </Gain>      

              <Gain>
                <Oscillator type="sine" frequency={[59, 111, 203, 567]} />
                <Param name="gain" value={1} targetValue={0.001} duration={10} method="exp" ></Param>
              </Gain>

              <Gain>
                <Oscillator type="sine" frequency={[247, 435, 623, 809, 809.05]} />
                <Param name="gain" value={0.5} targetValue={0.001} duration={45} method="exp" ></Param>
              </Gain>
            </Instrument>   

            {

              /**
               * 
               * Interesting sounds
               * 
               * GONG: 
               * [247, 435, 623, 811]
               * 
               * 
               * BELL
               * 
               * 
               * GLASS PIANO
               * [229, 339, 449, 561, 671]
               * 
               * 
               * PERCUSSIVE
               * [111, 203, 293, 385, 475, 567]
               * 
               * 
               * SCI-FI 
               * [453, 457, 459, 461, 465, 467, 469, 473, 475, 477, 481, 483, 485, 489, 491, 493, 497]
               * [441, 447, 451, 455, 459, 463, 469, 473, 477]
               * [195, 207, 217, 227, 237, 247, 259, 269, 279, 289, 299, 311, 321]
               * [477, 483, 489, 495, 501, 507, 513, 519, 525, 531]
               * 
               * 
               * 
               * 
               * 
               * 
               * 
               * 
               */



            }
                       

            

          </Transport>



        </AudioContext>



      </header>
    </div>
  );
};
