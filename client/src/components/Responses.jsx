import { useState } from 'react'

function Responses({ responses }){

    return(
        <>
            {responses.map((response) => {
                <div className='response'>{response}</div>
            })}
        </>
    )
}

export default Responses