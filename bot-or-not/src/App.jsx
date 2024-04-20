import { useState } from 'react'
import './App.css'
import Display from './Display'

function App() {
  const [mode, setMode] = setMode("start");


  return (
    <>
      <div id='logo-div'>
        <h1>Bot or Not</h1>
      </div>
      {(mode === 'start') && <div className='choose-display'>
        <button onClick={() => setMode("display")}>Create Game</button>
        <button onClick={() => setMode("player")}>Join Game</button>
      </div>}
      <Display></Display>
    </>
  )
}

export default App
