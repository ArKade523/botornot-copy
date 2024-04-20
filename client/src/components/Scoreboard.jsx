function Scoreboard({ scores }) {
    return (
        <>
            {scores !== undefined &&
                scores.map((score) => {
                    <div className="score-box">
                        <div className="name">{score.name}</div>
                        <div className="score">{score.score}</div>
                    </div>
                })}
        </>
    )
}
export default Scoreboard
