function Scores({ scores, host, api }) {
    console.log("----");
    console.log(scores);
    return (
        <>
        {scores !== undefined &&
            scores.map((score) => {
                return(
                <div key={score.response} className="score-box">
                    <div className="response">{score.response}</div>
                    <div className="score">{score.votes}</div>
                </div>)
        })}
        {host && <button
                className="button"
                onClick={() => api.hostStartGame()}>Next Round</button>}
    </>
    )
}
export default Scores
