import React from 'react'
import Mpg from '../mpg/Mpg'
import PropertySetter from './PropertySetter'
import TrackSettings from './TrackSettings'
import { Button } from 'react-bootstrap'

export default (props: any) => {

  const {project} = props;

  return <>

    {/* <PropertySetter label="Name" type="string" value={project.name} onChange={(value: any) => {project.name = value; project.onChange()}} /> */}
    <PropertySetter label="Tempo" type="number" value={project.tempo} onChange={(value: any) => {project.tempo = value; project.onChange()}} />
    <PropertySetter label="Bars" type="number" value={project.bars} onChange={(value: any) => {project.bars = value; project.onChange()}} />

    <br />
    Defaults
    <PropertySetter label="Beats" type="number" value={project.defaultBeats || 16} onChange={(value: any) => {project.defaultBeats = value; project.onChange()}} />

    <br />
    <Mpg.Flex row>
      <Mpg.div grow></Mpg.div>
      <Button variant="dark" size="sm" onClick={()=>{
        project.tracks.push({ name: 'Track ' + project.tracks.length, beats: project.defaultBeats, measures: {}});
        project.onChange();
      }}>
        Add track
      </Button>
    </Mpg.Flex>
    

    {
      project.tracks.map((track: any, index: number) => {

        let title = track.name;
        
        if(track.instrument){
          title = track.name + ': ' + track.instrument.$params.name;
        }

        return <Mpg.Disclosure caption={title}>
          <TrackSettings project={project} track={track} />
        </Mpg.Disclosure>
      })
    }
    
    
    
  </>

}
