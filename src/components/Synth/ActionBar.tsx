import React from 'react';
import Mpg from '../mpg/Mpg'

//Synth
export default (props: any) => {

    {/* GENERATOR ACTIONS */}
    return <Mpg.div className="synth-action-bar" solid padding="0px 0">
      <Mpg.Flex row alignItems="center" tight> 
        
        <Mpg.Tag as="button" className="transparent touch align self stretch" textAlign="center" padding="0 1em" onClick={()=>{alert('Previous')}}>
          <Mpg.FontAwesomeIcon icon="arrow-left" size="1x"></Mpg.FontAwesomeIcon>  
        </Mpg.Tag>
        
        <Mpg.Tag as="button" className="transparent touch align self stretch" textAlign="center" padding="0 1em" onClick={()=>{alert('Next')}}>
          <Mpg.FontAwesomeIcon icon="arrow-right" size="1x"></Mpg.FontAwesomeIcon>  
        </Mpg.Tag>

        <Mpg.Tag as="button" grow className="block touch align self stretch" textAlign="center" onClick={()=>{props.generate()}}>
          <Mpg.FontAwesomeIcon icon="magic" size="2x"></Mpg.FontAwesomeIcon>  
        </Mpg.Tag>

        <Mpg.Tag as="button" grow className="block touch align self stretch" textAlign="center" onTouchStart={()=>{props.trigger()}}>
          <Mpg.FontAwesomeIcon icon="play" size="2x"></Mpg.FontAwesomeIcon>  
        </Mpg.Tag>

        <Mpg.Disclosure icon="sliders-h" transparent className="touch align self stretch" iconSize="2x">

          <h1>Instrument Settings</h1>

          <Mpg.Disclosure iconElement="&asymp;" caption="Tuning">
            <h1>Synth Tuning</h1>
          </Mpg.Disclosure>

          <Mpg.Disclosure iconElement="&#10547;" caption="ADSR">
            <h1>Synth ADSR</h1>
          </Mpg.Disclosure>

          <Mpg.Disclosure iconElement={<Mpg.FontAwesomeIcon icon="sliders-h" rotateDegrees={90} />} caption="EQ">
            <h1>Synth EQ</h1>
          </Mpg.Disclosure>

          <Mpg.Disclosure iconElement="&#10613;" caption="Compressor">
            <h1>Synth Compressor</h1>
          </Mpg.Disclosure>

        </Mpg.Disclosure>


        <Mpg.Tag as="button" grow className="block touch align self stretch" textAlign="center" onClick={()=>{alert('Save as')}}>
          <Mpg.FontAwesomeIcon icon="save" size="2x"></Mpg.FontAwesomeIcon>  
        </Mpg.Tag>

      </Mpg.Flex>
    </Mpg.div>

}