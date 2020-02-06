import React, { useState } from 'react'
import Mpg from '../mpg/Mpg'

export default (props: any) => {

  const {label, value, type, onChange, options} = props;

  const oldValue = value;
  const [newValue, setNewValue] = useState(value);

  const handleChange = () => {
    if(oldValue !== newValue) {
      if(onChange){
        onChange(newValue);
      }
    }
  };

  return <Mpg.Flex row alignItems="center" tight marginBottom={1}>

    <Mpg.div width={200} color="rgba(255,255,255,0.5)">
      {label}
    </Mpg.div>
    
    <Mpg.Disclosure caption={value} onClose={handleChange}>
    
      {
        props.options &&
        props.options.map((option: any, index: number) => props.element(option))
      }

      {
        !props.options &&
        <input style={{zIndex: 999999}} type={type} defaultValue={value} onChange={(e) => { 
          setNewValue(e.target.value) 
        }} />
      }
      
    </Mpg.Disclosure>

  </Mpg.Flex>
  
  
  


}
