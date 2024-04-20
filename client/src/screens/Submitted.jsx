import Players from "../components/Players"

function Submitted({ prompt, players }) {
    //need to implement icon players moving up when they have submitted their responses
    return (
        <>
            <p className="small-info">this is a timer</p>
            <p className="medium-info">{prompt}</p>
            <Players players={players ? players : []}></Players>
        </>
    )
}

export default Submitted
