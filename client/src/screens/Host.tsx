import { useEffect, useState } from "react"
import { useApi } from "../hooks/useApi"

function Host() {
    const api = useApi()
    const [host, setHost] = useState(false)

    useEffect(() => {
        if (api) {
            const socket = api.getSocket()
            console.log("Host id: ", api.roomState.hostID)
            console.log("Socket id: ", socket.id)
            if (api.roomState.hostID === socket.id) {
                setHost(true)
            }
        }
    }, [api, api?.roomState.hostID])

    return (
        <>
            <p className="medium-info">You're in.</p>
            <p className="medium-info">As soon as all the other players are in, start the game</p>
            {host && <button className="button" onClick={() => api?.startGame()}>Start Game</button>}
        </>
    )
}

export default Host
