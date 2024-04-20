function Responses({ players }) {
    return (
        <>
            {players.map((player) => {
                <div className="response-box">
                    <div className="response">{player.response}</div>
                    <div>{player.player ?? ''}</div>
                </div>
            })}
        </>
    )
}

export default Responses
