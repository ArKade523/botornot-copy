import { useState } from 'react'

function Join({ api }) {
    const [name, setName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    return (
        <>
            <form onSubmit={ (e) => {
                e.preventDefault()
                api.joinRoom(name, roomCode)
            }}>
                <input
                    type="text"
                    id="name-input"
                    className="input-box"
                    value={name}
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                ></input>
                <input
                    type="text"
                    id="room-code-input"
                    className="input-box"
                    value={roomCode}
                    placeholder='Room Code'
                    onChange={(e) => setRoomCode(e.target.value)}
                ></input>
                <button
                    type="submit"
                    className="submit-button"
                >
                    Enter
                </button>
            </form>
        </>
    )
}

export default Join
