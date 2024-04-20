import { useState } from 'react'

function Join({ api }) {
    const [name, setName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    return (
        <>
            <input
                type="text"
                id="name-input"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
            ></input>
            <input
                type="text"
                id="room-code-input"
                className="input-box"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            ></input>
            <button type="button" className="submit-button" onClick={() => {api.joinRoom(name, code)}}>
                Enter
            </button>
        </>
    )
}

export default Join
