import Players from "../components/Players"

function Submitted({ prompt, players }) {
    //need to implement icon players moving up when they have submitted their responses
    return (
        <>
            <div className="timer">this is a timer</div>
            <h2 className="prompt">{prompt}</h2>
            <Players players={players ? players : []}></Players>
        </>
    )
}

export default Submitted
