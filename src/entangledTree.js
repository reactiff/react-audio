var levels = [
    
    [{id: 'Context'}],

    [
      {id: 'Master', parents: ['Context']},
      {id: 'Analyzer'}
    ],

    [
      {id: 'Gain1', parents: ['Master']},
      {id: 'Gain2', parents: ['Master']},
      {id: 'Gain3', parents: ['Master']},
      {id: 'Gain4', parents: ['Master']},
      {id: 'Gain5', parents: ['Master']},
    ],

    [
      {id: 'Oscillator1', parents: ['Gain1']},
      {id: 'Oscillator2', parents: ['Gain1']},
      {id: 'Oscillator3', parents: ['Gain1']},
      {id: 'Oscillator4', parents: ['Gain1']},
      {id: 'Oscillator5', parents: ['Gain1']},

      {id: 'ParamGain1', parents: ['Gain1']},
      {id: 'ParamGain2', parents: ['Gain2']},
      {id: 'ParamGain5', parents: ['Gain5']},
    ],
    
  ]