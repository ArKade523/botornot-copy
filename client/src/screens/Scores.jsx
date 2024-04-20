function Scores({ scores }) {
    return (
        <>
        {scores !== undefined &&
            scores.map((score) => {
                return(
                <div className="score-box">
                    <div className="response">{score.response}</div>
                    <div className="score">{score.votes}</div>
                </div>)
        })}
    </>
    )
}
export default Scores
