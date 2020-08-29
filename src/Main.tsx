import React from 'react'

import Racks from './racks'
import Synth from './views/Synth'
import Song from './views/Song'
import Primes from './views/Primes'
import Lib from './views/Lib'
import Home from './views/Home'
import More from './views/More'
import Loops from './Loops/Loops'
import Streams from './views/Streams';

import { Switch, Route } from 'react-router-dom';

export default (props: any) => (
  <main id="main" >
    
    <Switch>
      <Route path='/streams' component={(r: any) => <Streams {...props} match={r.match} />}/>
      <Route path='/racks' component={(r: any) => <Racks {...props} match={r.match} />}/>
      <Route path='/more' component={(r: any) => <More {...props} match={r.match} />}/>
      <Route path='/synth' component={(r: any) => <Synth {...props} match={r.match} />}/>
      <Route path='/song' component={(r: any) => <Song {...props} match={r.match} />}/>
      <Route path='/primes' component={(r: any) => <Primes {...props} match={r.match} />}/>
      <Route path='/loops' component={(r: any) => <Loops {...props} match={r.match} />}/>
      <Route path='/lib' component={(r: any) => <Lib {...props} match={r.match} />}/>
      <Route path='/' exact={true} component={(r: any) => <Racks {...props} match={r.match} />}/>
    </Switch>

  </main>
)

