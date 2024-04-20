function Scores({ scores, host, api }) {
    console.log("----");
    console.log(scores);
    return (
        <>
        {scores !== undefined &&
            scores.map((score) => {
                return(
                <div key={score.response} className="response-votes">
                    <p className="response-votes-response">{score.response}</p>
                    <div className="response-votes-bottom">
                        <div className="response-votes-person">
                        <p className="response-votes-person-p">{score.player}</p>
                        </div>
                        <p class="response-votes-votes">{score.votes} votes</p>
                    </div>
                </div>)
        })}
        {host && <button
                className="button"
                onClick={() => api.hostStartGame()}>Next Round</button>}
    </>
    )
}
export default Scores
