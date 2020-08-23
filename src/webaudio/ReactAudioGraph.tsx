import React from 'react';

import AudioContext from './AudioContext';
import Analyzer from './Analyzer';
import AudioSource from './AudioSource';
import Constant from './Constant';
import Delay from './Delay';
import Feedback from './Feedback';
import Filter from './Filter';
import { FilterType } from './modules/FilterModule';
import Gain from './Gain';
import Instrument from './Instrument';
import Noise from './Noise';
import Oscillator from './Oscillator';
import Param from './Param';
import Slider from './Slider';
import {TransitionMethod} from './modules/ParamModule';
import Position from './Position';
import StreamPlayer from './StreamPlayer'
import StreamRecorder from './StreamRecorder'
import Split from './Split';
import Stereo from './Stereo';
import Transport from './Transport';
import note from './modules/Notes';



const ReactAudioGraph = {
    AudioContext : AudioContext , 
    Analyzer : Analyzer , 
    AudioSource : AudioSource , 
    Constant : Constant , 
    Delay : Delay , 
    Feedback : Feedback , 
    Filter : Filter , 
    FilterType : FilterType , 
    Gain : Gain , 
    Instrument : Instrument , 
    Noise : Noise , 
    Oscillator : Oscillator , 
    Param : Param , 
    Slider : Slider , 
    TransitionMethod : TransitionMethod , 
    Position : Position , 
    StreamPlayer : StreamPlayer,
    StreamRecorder : StreamRecorder , 
    Split : Split , 
    Stereo : Stereo , 
    Transport : Transport , 
    note : note , 

}

export default ReactAudioGraph