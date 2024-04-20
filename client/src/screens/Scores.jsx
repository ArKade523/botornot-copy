import Scoreboard from '../components/Scoreboard'

function Scores({ players }) {
    return (
        <>
            <Scoreboard score={players}></Scoreboard>
        </>
    )
}
export default Scores
