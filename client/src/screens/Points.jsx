function Points({ players }) {
    return (
        <>
        {players !== undefined &&
            players.map((player) => {
                return(
                <div key={player.player} className="score-box">
                    <div className="response">{player.player}</div>
                    <div className="score">{player.points}</div>
                </div>)
        })}
    </>
    )
}
export default Points