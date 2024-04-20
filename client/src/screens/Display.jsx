import Players from '../components/Players'

function Display({ code, players }) {
    return (
        <>
            <p>
                In this game, you will all respond to prompts pretending to be bots. One of the
                responses will be from a real bot. Earn points by fooling your friends and finding
                the actual bot.
            </p>
            <div className="code-div">
                <p>Go to domain and click Join Game. Enter the code when prompted</p>
                <h3 className="code">{code}</h3>
            </div>
            <Players players={players}></Players>
        </>
    )
}

export default Display
