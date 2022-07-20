import React,{useState,useEffect} from 'react';
import './App.css';
import MainPage from "./components/MainPage"
import Games from './components/Games';
import HeaderContent from "./components/HeaderContent"
import { AppShell,Header,MantineProvider,ColorSchemeProvider, ColorScheme } from '@mantine/core';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "./firebase-config"
import { GamePage } from './components/GamePage';
function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [logged,setLogged]=useState(false)
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      setLogged(old=>!old)
    })
  },[])
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <BrowserRouter>
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
    <MantineProvider 
    styles={{Title:(theme)=>({root:colorScheme==="dark"?{color:theme.colors.gray[3]}:{color:theme.colors.black}}),Text:(theme)=>({root:colorScheme==="dark"?{color:theme.colors.gray[3]}:{color:theme.colors.black}})}}
    theme={{ colorScheme:colorScheme,primaryColor:"indigo"}}>
      <AppShell
      header={<Header   height={"fit-content"} p="xl"><HeaderContent setLogged={setLogged} toggle={toggleColorScheme} dark={colorScheme==="dark"}/></Header>}
      styles={(theme) => ({
        main: { flexGrow:1,backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      
        <Routes>
          <Route path="/" element={<MainPage colorScheme={colorScheme}/>}/>
          <Route path="/games" element={<Games colorScheme={colorScheme}/>}/>
          <Route path="/games:id" element={<GamePage colorScheme={colorScheme}/>}/>
        </Routes>
      
    </AppShell>
    </MantineProvider>
    </ColorSchemeProvider>
    </BrowserRouter>
  );
}

export default App;
