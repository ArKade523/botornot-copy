import { useState } from 'react'

function Input({ operation }) {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');

  return (
    <>
        {(operation!=='display') && <input type='text' id='name-input' className='input-box' value={name} onChange={e => setName(e.target.value)}></input>}
        <input type='text' id='room-code-input' className='input-box' value={roomCode} onChange={e => setRoomCode(e.target.value)}></input>
        <button type='button' className='submit-button' onClick={() => {

        }}>{operation}</button>
    </>
  )
}

export default Input