function Players({ players }) {
    return (
        <>
            {players.map((player) => {
                return (
                    <div key={player} className="person">
                        <p className="">{player}</p>
                        <p>{player.score ?? ''}</p>
                    </div>
                )
            })}
        </>
    )
}
export default Players
