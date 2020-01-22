import React from 'react'

import Synth from './Synth'
import Lib from './Lib'
import Home from './Home'
import More from './More'
import Loops from './Loops'

import { Switch, Route } from 'react-router-dom';

export default (props: any) => (
  <main id="main" >
    
    <Switch>
      <Route path='/more' component={(r: any) => <More {...props} match={r.match} />}/>
      <Route path='/synth' component={(r: any) => <Synth {...props} match={r.match} />}/>
      <Route path='/loops' component={(r: any) => <Loops {...props} match={r.match} />}/>
      <Route path='/lib' component={(r: any) => <Lib {...props} match={r.match} />}/>
      <Route path='/' exact={true} component={(r: any) => <Home {...props} match={r.match} />}/>
    </Switch>

  </main>
)
