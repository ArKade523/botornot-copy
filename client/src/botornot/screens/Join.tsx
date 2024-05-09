import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { PlayerState } from './Player'
import { toast } from 'react-toastify'

function Join({ setState }: { setState: React.Dispatch<React.SetStateAction<PlayerState>> }) {
    const [name, setName] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [codeValid, setCodeValid] = useState(false)
    const api = useApi()
    const socket = api?.getSocket()

    const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        api?.joinRoom(name, roomCode)
    }

    useEffect(() => {
        if (socket) {
            socket.on('join_code_valid', () => {
                setCodeValid(true)
            })
        }
    }, [socket])

    useEffect(() => {
        if (codeValid) {
            toast.success('Code Valid')
            setState(PlayerState.HOST)
        }
    }, [codeValid])

    return (
        <>
            <form className="form" onSubmit={joinRoom}>
                <p className="input-desc">Enter name:</p>
                <input
                    type="text"
                    id="name-input"
                    className="input"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                ></input>
                <p className="input-desc">Enter code:</p>
                <input
                    type="text"
                    id="room-code-input"
                    className="input"
                    value={roomCode}
                    placeholder="Room Code"
                    onChange={(e) => setRoomCode(e.target.value)}
                    required
                ></input>
                <button type="submit" className="button">
                    Enter
                </button>
            </form>
        </>
    )
}

export default Join
