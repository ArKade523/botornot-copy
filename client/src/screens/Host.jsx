function Host({ host, api }) {
    return (
        <>
            <p>You're in.</p>
            <p>As soon as all the other players are in, start the game</p>
            {host && <button onClick={api.hostStartGame()}>Start Game</button>}
        </>
    )
}

export default Host
