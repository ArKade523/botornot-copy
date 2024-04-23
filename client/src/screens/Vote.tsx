import { useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import useCountdownTimer from '../hooks/useCountdownTimer'

function Vote({ prompt }: { prompt: string }) {
    const { seconds, resetTimer } = useCountdownTimer(20)
    const api = useApi()
    const responses = api?.getResponseStrings()

    useEffect(() => {
        if (api?.isDisplay()) {
            resetTimer(20)
        }
    }, [])

    return (
        <>
            <p className="small-info">{seconds} seconds left</p>
            <p className="medium-info">{prompt}</p>
            <p className="small-info">Who is the bot?</p>
            {responses && api && !api.isDisplay() &&
                responses.map((response) => {
                    return (
                        <button
                            className="button"
                            key={response}
                            onClick={(e) => {
                                e.preventDefault()
                                api?.vote(response)
                            }}
                        >
                            {response}
                        </button>
                    )
                })
            }
            {/* Only use buttons if the player is not the display */}
            {responses && api && api.isDisplay() &&
                responses.map((response) => {
                    return (
                        <p
                            className="response"
                            key={response}
                        >
                            {response}
                        </p>
                    )
                })
            }
        </>
    )
}
export default Vote
