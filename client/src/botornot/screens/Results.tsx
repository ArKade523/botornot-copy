import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'

function Results() {
    const api = useApi()
    const host = api?.isHost()
    const lastRound = api?.isLastRound()
    const [scores, setScores] = useState<
        { response: string; votes: number; playerName: string }[] | undefined
    >(undefined)

    useEffect(() => {
        if (api) {
            const retrievedScores = api.getFullRoundResponses().map((response) => {
                return {
                    response: response.response,
                    votes: response.votes,
                    playerName: api.roomState.players[response.playerID].name
                }
            })
            setScores(retrievedScores)
        }
    }, [])

    return (
        <>
            {scores !== undefined &&
                scores.map((score) => {
                    return (
                        <div key={score.response} className="response-votes">
                            <p className="response-votes-response">{score.response}</p>
                            <div className="response-votes-bottom">
                                <div className="response-votes-person">
                                    <p className="response-votes-person-p">{score.playerName}</p>
                                </div>
                                <p className="response-votes-votes">{score.votes} votes</p>
                            </div>
                        </div>
                    )
                })}
            {lastRound ? (
                <button className="button" onClick={() => api?.finish()}>
                    Finish Game
                </button>
            ) : (
                host && (
                    <button className="button" onClick={() => api?.nextRound()}>
                        Next Round
                    </button>
                )
            )}
        </>
    )
}

export default Results
