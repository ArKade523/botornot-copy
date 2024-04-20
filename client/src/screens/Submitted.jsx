import Players from "../components/Players"
import useCountdownTimer from "../hooks/useCountdownTimer"

function Submitted({ prompt, players }) {
    const seconds = useCountdownTimer(30)

    return (
        <>
            <p className="small-info">{seconds} seconds left</p>
            <p className="medium-info">{prompt}</p>
            <Players players={players ? players : []}></Players>
        </>
    )
}

export default Submitted
