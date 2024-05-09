import { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './botornot/App.tsx'
import './index.css'
import { Api, ApiContext } from './botornot/utils/api.ts'
import './App.css'
import Home from './home/pages/Home.tsx'
import HomeLayout from './home/HomeLayout.tsx'
import About from './home/pages/About.tsx'
import Login from './home/pages/Login.tsx'

const router = createHashRouter([
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/about', element: <About />},
            { path: '/login', element: <Login />}
        ]
    },
    { path: 'botornot', element: <App />}
])

function Main() {
    const apiRef = useRef(new Api(null))

    return (
        <ApiContext.Provider value={apiRef.current}>
            <RouterProvider router={router} />
        </ApiContext.Provider>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Main />)
