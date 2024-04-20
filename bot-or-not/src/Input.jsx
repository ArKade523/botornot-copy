import { useState } from 'react'

function Input({ operation }) {
    const [input, setInput] = useState('');


  return (
    <>
        <input type='text' className='input-box' value={input} onChange={e => setInput(e.target.value)}></input>
        <button type='button' className='submit-button' onClick={() => {

        }}>{operation}</button>
    </>
  )
}

export default Input