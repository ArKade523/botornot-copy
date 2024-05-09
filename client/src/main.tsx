import { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './botornot/App.tsx'
import './index.css'
import { Api, ApiContext } from './utils/api.js'
import './App.css'
import Home from './home/pages/Home.tsx'
import HomeLayout from './home/HomeLayout.tsx'
import About from './home/pages/About.tsx'
import Login from './home/pages/Login.tsx'
import Register from './home/pages/Register.tsx'
import Dashboard from './home/pages/Dashboard.tsx'
import { Provider } from 'react-redux'
import store from './store.ts'

const router = createHashRouter([
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/about', element: <About /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/dashboard', element: <Dashboard /> }
        ]
    },
    { path: 'botornot', element: <App /> }
])

function Main() {
    const apiRef = useRef(new Api(null))

    return (
        <ApiContext.Provider value={apiRef.current}>
            <RouterProvider router={router} />
        </ApiContext.Provider>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <Main />
    </Provider>
)
