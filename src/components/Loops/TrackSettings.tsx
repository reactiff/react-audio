import React from 'react'
import Mpg from '../mpg/Mpg'
import PropertySetter from './PropertySetter'

import { Button } from 'react-bootstrap'

export default (props: any) => {

  const {project, track} = props;

  return <>

    {/* <PropertySetter label="Name" type="string" value={track.name} onChange={(value: any) => {track.name = value; project.onChange()}} /> */}

    <PropertySetter label="Beats" type="number" value={track.beats} onChange={(value: any) => {track.beats = value; project.onChange()}} />
    <PropertySetter 
      label="Instrument" 
      value={track.instrument && track.instrument.$params.name} 
      options={project.instruments} 
      element={(option: any) => {
        return <Mpg.Disclosure 
          caption={option.$params.name} 
          header="yo"
          onClick={() => {
            track.instrument = option; 
            project.onChange();
          }} 

        />
      }}
    />
    
  </>

}
