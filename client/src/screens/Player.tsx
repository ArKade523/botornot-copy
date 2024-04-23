import { useEffect, useState } from "react"
import Join from "./Join"
import Host from "./Host"
import { useApi } from "../hooks/useApi"
import Introduction from "./Introduction"

export enum PlayerState {
    JOIN,
    HOST,
    INTRODUCTION,
}

export function Player() {
    const [state, setState] = useState(PlayerState.JOIN)
    const api = useApi()
    const socket = api?.getSocket()

    useEffect(() => {
        if (socket) {
            socket.on('game_started', () => {
                setState(PlayerState.INTRODUCTION)
            })
        }

        return () => {
            socket?.off('game_started')
        }

    }, [socket])

    return (
        <>
            {state === PlayerState.JOIN && <Join setState={setState}/>}
            {state === PlayerState.HOST && <Host />}
            {state === PlayerState.INTRODUCTION && <Introduction />}
        </>
    )
}