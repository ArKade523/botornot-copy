function Host({ host, api }) {
    return (
        <>
            <p className="medium-info">You're in.</p>
            <p className="medium-info">As soon as all the other players are in, start the game</p>
            {host && <button className="button" onClick={() => api.hostStartGame()}>Start Game</button>}
        </>
    )
}

export default Host
