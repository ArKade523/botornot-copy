import { useState } from 'react'

function Responses({ players }) {
    return (
        <>
            {players.map((players) => {
                ;<div className="response-box">
                    <div className="response">{players.response}</div>
                    <div>{players.player ?? ''}</div>
                </div>
            })}
        </>
    )
}

export default Responses
