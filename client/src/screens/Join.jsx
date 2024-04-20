import { useState } from 'react'

function Join({ api }) {
    const [name, setName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    return (
        <>
            <form 
                className="form"
                onSubmit={ (e) => {
                e.preventDefault()
                api.joinRoom(name, roomCode)
            }}>
                <p className="input-desc">Enter name:</p>
                <input
                    type="text"
                    id="name-input"
                    className="input"
                    value={name}
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                ></input>
                <p className="input-desc">Enter code:</p>
                <input
                    type="text"
                    id="room-code-input"
                    className="input"
                    value={roomCode}
                    placeholder='Room Code'
                    onChange={(e) => setRoomCode(e.target.value)}
                ></input>
                <button
                    type="submit"
                    className="button"
                >
                    Enter
                </button>
            </form>
        </>
    )
}

export default Join
