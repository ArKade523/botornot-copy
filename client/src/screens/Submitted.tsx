import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'
import useCountdownTimer from '../hooks/useCountdownTimer'

function Submitted({ prompt }: { prompt: string }) {
    const api = useApi()
    const socket = api?.getSocket()
    const { resetTimer } = useCountdownTimer(30)
    const [seconds, setSeconds] = useState(30)

    useEffect(() => {
        resetTimer(30)
    }, [])

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

    useEffect(() => {
        if (api) {
            if (
                api.roomState.responses.length === Object.keys(api.roomState.players).length ||
                seconds === 0
            ) {
                socket.emit('all_responses_submitted')
            }
        }

    }, [seconds, socket])

    return (
        <>
            <p className="small-info">{seconds} seconds left</p>
            <p className="medium-info">{prompt}</p>
        </>
    )
}

export default Submitted
