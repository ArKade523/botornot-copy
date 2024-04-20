function Players({ players }) {
    return (
        <>
            {players.map((player) => {
                <div className="player-tile">
                    <p>{player.player}</p>
                    <p>{player.score ?? ''}</p>
                </div>
            })}
        </>
    )
}
export default Players
