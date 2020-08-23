import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { library as faLib } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import Mpg from '../mpg/Mpg';
import './app.css';
import './themes/dark-mode.css';

import Main from '../Main';
import ThemeLoader from './ThemeLoader';

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
  const flowStyle: any = {};
  if(flowHidden){
    flowStyle.display = 'none';
  }

  // UI MAP
  // https://app.mindmup.com/map/_free/2020/01/1d069780382811eab8aa5920fb3c8d33
  
  return <>

    <ThemeLoader theme={theme}/>
    
    <div className="flow-root no-select" style={flowStyle}>

      <Main {...{
          theme: theme, 
          setTheme: handleSetTheme,
          setBottomNavHidden: setBottomNavHidden,
          setFlowHidden: setFlowHidden,
        }
      }/>

      <Mpg.Navbar 
        ref={bottomNavBarRef} 
        location={props.location} 
        routes={{
          test: { icon: 'flask', path: '/test', exact: true },
          home: { icon: 'home', path: '/', exact: true },
          synth: { icon: 'flask', path: '/synth', exact: true },
          song: { icon: 'flask', path: '/song', exact: true },
          primes: { icon: 'flask', path: '/primes', exact: true },
          loops: { icon: 'grip-horizontal', path: '/loops', exact: true },
          library: { icon: 'book-open', path: '/lib', exact: true },
          more: { icon: 'ellipsis-h', path: '/more' },
        }} 
      fixedTop/>

    </div>

    <div id="fixedRoot" className="no-select"></div>
    
  </>;

};
