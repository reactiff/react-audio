import React from 'react'
import Mpg from '../mpg/Mpg'
import PropertySetter from './PropertySetter'

import { Button } from 'react-bootstrap'

export default (props: any) => {

  const {project, instruments, track} = props;

  return <>

    {/* <PropertySetter label="Name" type="string" value={track.name} onChange={(value: any) => {track.name = value; project.onChange()}} /> */}

    <PropertySetter label="Beats" type="number" value={track.beats} onChange={(value: any) => {track.beats = value; project.onChange()}} />

    <PropertySetter 
      label="Instrument" 
      value={track.instrumentName} 
      options={Object.keys(instruments).map(key => instruments[key])} 
      element={(instrument: any) => {
        return <Mpg.Disclosure 
          key={instrument.id}
          iconElement={<Mpg.div width={20}>
            {
              track.instrumentName === instrument.name && 
              <span>&#10003;</span>
            }
          </Mpg.div>}
          caption={instrument.name} 
          header="yo"
          onClick={() => {
            track.instrumentName = instrument.name; 
            project.onChange();
          }} 

        />
      }}
    />
    
  </>

}
