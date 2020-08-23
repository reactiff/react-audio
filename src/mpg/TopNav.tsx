import React, {useState, useEffect} from 'react'
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import Mpg from './Mpg'
import { useBootstrapGridSize } from '../hooks/Hooks'
import { useHistory } from 'react-router-dom'

export default (props: any) => {

  const history = useHistory()
  const [expanded, toggleExpanded] = useState(false)

  const gridSize = useBootstrapGridSize()

  //#region Helper Functions
  const navigate = (url: string) => {
    history.push(url)
    toggleExpanded(false)
  }
  const logout = (props: any, toggleExpanded: Function) => { 
    // props.setIdentity(null)
    toggleExpanded(false)
  }
  //#endregion

  //#region Effects
  useEffect(()=>{
    if(expanded){
      const classes = document.body.className.split(' ')
      if(!classes.includes('menu-open')){
        classes.push('menu-open')
      }
      document.body.className = classes.filter(x=>x!=='').join(' ')
    }
    else{
      const classes = document.body.className.replace(/menu\-open/gi, '').split(' ')
      document.body.className = classes.filter(x=>x!=='').join(' ')
    }
  }, [expanded])
  //#endregion

  const variant = props.theme === 'dark' ? 'dark' : 'light'
  
  const navbar: any = {
    fixed: "top",
    brand: true,
  }

  if(gridSize === 'xs' || gridSize === 'sm'){
    navbar.style = {display: 'none'}
  }
  
  return (
    <>
      <header>
        
        <Navbar 
          fixed={navbar.fixed}
          expanded={expanded} 
          bg={variant} 
          variant={variant}
          expand="md" 
          style={navbar.style}
          onToggle={() => {
            toggleExpanded(!expanded)
          }}>

          <Container fluid>

            {
              
              <Navbar.Brand>
                <Nav>
                  <Button variant="link" onClick={()=>navigate('/')}>
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}
                    {/* <img src={Config.url.cdn + '/entity/studio/root/4b1bb02d-93c4-4a6d-9fd7-b6d53e201a16/120x120'} alt="logo"></img> */}
                    
                  </Button>
                </Nav>
              </Navbar.Brand>
            }
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" bsPrefix={"mobile-only hamburger hamburger--spin " + (expanded ? "is-active" : "")}>
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav">
              
              <Nav className="mr-auto">

                <Nav>
                  <Mpg.Flex row tight justifyContent="flex-end">
                    <Button variant="link" onClick={()=>navigate('/')}>
                      Synth
                    </Button>
                  </Mpg.Flex>
                </Nav>

                <Nav>
                  <Mpg.Flex row tight justifyContent="flex-end">
                    <Button variant="link" onClick={()=>navigate('/lib')}>
                      Lib
                    </Button>
                  </Mpg.Flex>
                </Nav>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      
    </>
  )
}
