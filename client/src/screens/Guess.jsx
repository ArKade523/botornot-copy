import Responses from '../components/Responses'

function Guess({ prompt, players }) {
    return (
        <>
            <h2 className="prompt">{prompt}</h2>
            <p>Who is the bot?</p>
            <Responses players={players}></Responses>
        </>
    )
}
export default Guess
