import React, { useRef } from 'react';
import {useState, useEffect, useMemo} from 'react';
import Mpg from '../mpg/Mpg';
import Inline from '../shared/Inline';
import { useWindowSize } from '../hooks/Hooks';

import './loops.css';

import BottomToolbar from './BottomToolbar';

import CircularTrack from './CircularTrack';
import Playback from './Playback';
import ProjectWebAudioSetup from './ProjectWebAudioSetup';
import ProjectSettings from './ProjectSettings';
import initProjectData from './initProjectData';


export default (props: any) => {

  const project = useRef<any>({ tracks: [] });
  const [projectRevision, setProjectRevision] = useState(0);
 
  const resources = useRef<any>({ instruments: {} });

  const [playbackState, setPlaybackState] = useState(0);
  const [currentMeasureNumber, setCurrentMeasureNumber] = useState(0);
  
  const windowSize = useWindowSize();
  const maxDiameter = Math.min(windowSize.width, windowSize.height - 55 - 30);
  const maxRadius = maxDiameter / 2;
  const trackWidth = Math.min((maxRadius - 60) / (project.current.tracks.length ), 60);

  // handlers
  const handleMeasureNumberChange = (measureNumber: number) => {
    setCurrentMeasureNumber(measureNumber);
  }
  const handlePlayStop = () => {
    playbackRef.current.trigger();
  }
  const handleRegisterInstrument = (inst: any) => {
    resources.current.instruments[inst.$params.name] = inst;
  }

  const playbackRef = useRef<any>(new Playback());
  project.current = React.useMemo(()=>{
    let projectData = initProjectData;
    // const savedProjectDataJson = localStorage.getItem('project');
    // let projectData = null;
    // if(!savedProjectDataJson) {
    //   projectData = staticProjectData;
    // }
    // else{
    //   projectData = JSON.parse(savedProjectDataJson);
    //   if(!projectData.version || projectData.version < staticProjectData.version){
    //     projectData = staticProjectData;
    //   }
    // }
    return projectData;
  },[]);

  project.current.onChange = () => {
    const json = JSON.stringify(project.current);
    localStorage.setItem('project', json);
    setProjectRevision(r => r + 1);
  };

  useEffect(()=>{
    // Wire up playback component
    playbackRef.current.subscribe('onStateChange', setPlaybackState);
    playbackRef.current.subscribe('onMeasureNumberChange', handleMeasureNumberChange);
    playbackRef.current.setProject(project);
    playbackRef.current.setResources(resources);
  },[]);
  
  //memoized
  const playButton = useMemo(() => {
    let icon = Inline.switch(playbackState, 'play', 1, 'stop', 2, 'play-circle')
    return <Mpg.FontAwesomeIcon icon={icon} size="2x"/>
  }, [playbackState])

  const loopWheel = useMemo(() => {

    return (
      <svg width={maxDiameter} height={maxDiameter}>
        {
          project.current.tracks.map((track: any, index: number) => {
            return <CircularTrack 
              key={index} 
              playbackRef={playbackRef.current} 
              trackIndex={index} 
              wheelRadius={maxRadius} 
              outerRadius={maxRadius - trackWidth * index} 
              width={trackWidth} 
              track={track} />
          })
        }
      </svg>
    );

  }, [maxDiameter, trackWidth]);


  return <>

    <Mpg.Flex className="loop-panel" translucent tight alignItems="center" justifyContent="center" noMargin column>  

      {
        // Instruments
        useMemo(() => {
          return <ProjectWebAudioSetup handleRegisterInstrument={handleRegisterInstrument} />
        }, [])
      }

      <Mpg.Flex className="toolbar top" row justifyContent="center" alignItems="center" wide absolute anchorTop padding={20}>

        <Mpg.div width={40}>
          &nbsp;
        </Mpg.div>

        <Mpg.div grow>
          &nbsp;
        </Mpg.div>

        <Mpg.div>
          <Mpg.Flex bgColor="black" width={50} height={50} round justifyContent="center" alignItems="center">
            {project.current.tempo}
          </Mpg.Flex>
        </Mpg.div>

        <Mpg.div grow>
          &nbsp;
        </Mpg.div>

        <Mpg.div>
          <Mpg.Disclosure width={40} header="Project settings">
            <ProjectSettings project={project.current} instruments={resources.current.instruments} />
          </Mpg.Disclosure>
        </Mpg.div>

      </Mpg.Flex>

      <Mpg.div className="loop-wheel-container" width={maxDiameter} height={maxDiameter}>

        {/* LOOP WHEEL */}
        <Mpg.Flex className="loop-wheel" borderRadius="50%" tight alignItems="center" justifyContent="center">
          

          {loopWheel}

          <Mpg.Flex 
            tight
            className="current-measure"
            justifyContent="center"
            alignItems="center"
            borderRadius="50%"
            width={maxRadius - trackWidth * 4}
            height={maxRadius - trackWidth * 4}
            fontSize={currentMeasureNumber === 0 ? '1rem' : '4rem'}>{currentMeasureNumber === 0 ? 'Press Play' : currentMeasureNumber}</Mpg.Flex>
        </Mpg.Flex>
      </Mpg.div> 

      
      
    



      <BottomToolbar { ...{ playButton, handlePlayStop } } />
      
      


     


      
    </Mpg.Flex>

  </>

}


