import Players from '../components/Players'

function Display({ code, players }) {
    return (
        <div className="join-content">
            <div className="persons">
                {players.length === 0 && <p className="medium-info">No Players</p>}
                <Players players={players}></Players>
            </div>
            <div className="join-info">
                <p className="small-info">
                    In this game, you will all respond to prompts pretending to be bots. One of the
                    responses will be from a real bot. Earn points by fooling your friends and finding
                    the actual bot.
                </p>

                <p className="small-info">Go to domain and click Join Game. Enter the code when prompted</p>
                <p className="join-code">{code}</p>
            </div>
        </div>
    )
}

export default Display
