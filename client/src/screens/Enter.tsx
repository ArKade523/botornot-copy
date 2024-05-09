import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { PlayerState } from './Player'

function Enter({
    prompt,
    setState
}: {
    prompt: string
    setState: React.Dispatch<React.SetStateAction<PlayerState>>
}) {
    const [response, setResponse] = useState('')
    const [seconds, setSeconds] = useState(30)
    const api = useApi()
    const socket = api?.getSocket()

    const submitResponse = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submit response: ', response)
        api?.submitResponse(response)
        setResponse('')
        setState(PlayerState.WAIT)
    }

    useEffect(() => {
        if (socket) {
            socket.on('countdown_seconds', ({ seconds }: { seconds: number }) => {
                setSeconds(seconds)
            })
        }

        return () => {
            socket?.off('countdown_seconds')
        }
    }, [socket])

    return (
        <>
            <p className="small-info">{seconds} seconds left</p>
            <p className="medium-info">{prompt && prompt}</p>
            <form className="form" onSubmit={submitResponse}>
                <textarea
                    placeholder="Enter response here"
                    className="input textarea"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                ></textarea>
                <button type="submit" className="button">
                    Submit
                </button>
            </form>
        </>
    )
}

export default Enter
