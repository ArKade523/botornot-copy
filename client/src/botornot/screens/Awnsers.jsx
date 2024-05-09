import Responses from '../components/Responses'

function Awnsers({ prompt, players }) {
    return (
        <>
            <h2 className="prompt">{prompt}</h2>
            <p>Here is what you said</p>
            <Responses players={players}></Responses>
        </>
    )
}
export default Awnsers
