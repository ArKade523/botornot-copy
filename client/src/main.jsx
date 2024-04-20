import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Api, ApiContext } from './utils/api.js'

function Main() {
  const apiRef = useRef(new Api(null))

  return (
    <ApiContext.Provider value={apiRef.current}>
      <App />
    </ApiContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Main />
)
