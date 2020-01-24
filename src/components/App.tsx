import React from 'react';
import { useState, useEffect, useRef } from 'react';

import Main from './Main';
import Loops from './Loops'
import ThemeLoader from './ThemeLoader';

import Mpg from './mpg/Mpg';
import { library as faLib } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import './css/app.css';
import './css/themes/dark-mode.css';

export default (props: any) => {

  faLib.add(fas, far);

  // THEME
  const storedTheme = localStorage.getItem('theme') || 'dark';
  const [theme, setTheme] = useState(storedTheme);
  const handleSetTheme = (newTheme: string) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    return true;
  };

  // NAV BAR
  const bottomNavBarRef = useRef<any>();
  const [navBarRef, setNavBarRef] = useState(null);
  const setBottomNavHidden = (hidden: boolean) => {
    if(bottomNavBarRef.current){
      bottomNavBarRef.current.style.display = hidden ? 'none' : 'flex';
    }
  };

  const [flowHidden, setFlowHidden] = useState(false);

  let body = null;
  const other = {
    theme: theme, 
    setTheme: handleSetTheme,
    setBottomNavHidden: setBottomNavHidden,
    setFlowHidden: setFlowHidden,
  };

  body = <Loops {...other} />;

  const flowStyle: any = {};
  if(flowHidden){
    flowStyle.display = 'none';
  }
  
  
  const navRoutes = {
    home: { icon: 'home', path: '/', exact: true },
    synth: { icon: 'flask', path: '/synth', exact: true },
    loops: { icon: 'grip-horizontal', path: '/loops', exact: true },
    library: { icon: 'book-open', path: '/lib', exact: true },
    more: { icon: 'ellipsis-h', path: '/more' },
  };


  // UI MAP
  // https://app.mindmup.com/map/_free/2020/01/1d069780382811eab8aa5920fb3c8d33
  
  return <>

    <ThemeLoader theme={theme}/>
    
    <div className="flow-root no-select" style={flowStyle}>

      {body}

      {/* <Mpg.Navbar ref={bottomNavBarRef} location={props.location} routes={navRoutes} fixedTop/> */}

    </div>

    <div id="fixedRoot" className="no-select"></div>
    
  </>;

};
