import { useEffect, useState } from 'react'
import logo_image from '../../../images/logo.svg'
import { useApi } from '../hooks/useApi'
import Display from './screens/Display'
import { Player } from './screens/Player'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

enum AppState {
    Home,
    Display,
    Player
}

export default function App() {
    const [state, setState] = useState(AppState.Home)
    const api = useApi()
    const socket = api?.getSocket()

    const setDisplay = () => {
        setState(AppState.Display)
        if (api?.roomState) {
            Object.assign(api.roomState, { displayID: socket?.id })
        }

        api?.createRoom()
    }

    useEffect(() => {
        if (socket) {
            socket.on('error', ({ message }: { message: string }) => {
                toast.error(message)
            })
        }

        return () => {
            socket?.off('error')
        }
    }, [socket])

    return (
        <>
            <div className="header">
                <div id="logo-div" className="logo-box">
                    <img className="logo-img" src={logo_image} />
                    <h1 className="logo-h1">Bot or Not</h1>
                </div>
            </div>
            <ToastContainer />
            <div className="content home-content">
                {state === AppState.Home && (
                    <>
                        <button onClick={setDisplay} className="button">
                            Create Game
                        </button>
                        <button
                            onClick={() => {
                                setState(AppState.Player)
                            }}
                            className="button"
                        >
                            Join Game
                        </button>
                    </>
                )}
                {state === AppState.Player && <Player />}
                {state === AppState.Display && <Display />}
            </div>
        </>
    )
}
