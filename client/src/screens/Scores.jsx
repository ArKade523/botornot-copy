function Scores({ scores, host, api }) {
    console.log("----");
    console.log(scores);
    const lastRound = scores[0].lastRound;

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
                        <p className="response-votes-votes">{score.votes} votes</p>
                    </div>
                </div>)
        })}
        {lastRound ? <button
                className="button"
                onClick={() => api.finish()}>Finish Game</button>: (host && <button
                className="button"
                onClick={() => api.hostStartGame()}>Next Round</button>)}
        
    </>
    )
}
export default Scores
