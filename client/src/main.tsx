import { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Api, ApiContext } from './utils/api.ts'
import './App.css'

function Main() {
    const apiRef = useRef(new Api(null))

    return (
        <ApiContext.Provider value={apiRef.current}>
            <App />
        </ApiContext.Provider>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />)
