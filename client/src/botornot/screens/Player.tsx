import { useEffect, useState } from 'react'
import Join from './Join'
import Host from './Host'
import { useApi } from '../../hooks/useApi'
import Introduction from './Introduction'
import Enter from './Enter'
import Vote from './Vote'
import Results from './Results'

export enum PlayerState {
    JOIN,
    HOST,
    INTRODUCTION,
    RESPOND,
    WAIT,
    VOTE,
    RESULTS
}

export function Player() {
    const [state, setState] = useState(PlayerState.JOIN)
    const [prompt, setPrompt] = useState<string | undefined>(undefined)
    const api = useApi()
    const socket = api?.getSocket()

    useEffect(() => {
        if (socket) {
            socket.on('game_started', () => {
                setState(PlayerState.INTRODUCTION)
            })

            socket.on('display_prompt', ({ prompt }: { prompt: string }) => {
                console.log(prompt)
                setPrompt(prompt)
                setState(PlayerState.RESPOND)
            })

            socket.on('all_responses_submitted', () => {
                setState(PlayerState.VOTE)
            })

            socket.on('vote_submitted', ({ response }: { response: string }) => {
                console.log('vote_submitted', response)
                setState(PlayerState.WAIT)
            })

            socket.on('all_votes_submitted', () => {
                setState(PlayerState.RESULTS)
            })
        }

        return () => {
            socket?.off('game_started')
            socket?.off('display_prompt')
            socket?.off('all_responses_submitted')
            socket?.off('vote_submitted')
            socket?.off('all_votes_submitted')
        }
    }, [socket])

    return (
        <>
            {state === PlayerState.JOIN && <Join setState={setState} />}
            {state === PlayerState.HOST && <Host />}
            {state === PlayerState.INTRODUCTION && <Introduction />}
            {state === PlayerState.RESPOND && (
                <Enter prompt={prompt ? prompt : ''} setState={setState} />
            )}
            {state === PlayerState.WAIT && <p>WAIT</p>}
            {state === PlayerState.VOTE && <Vote prompt={prompt ? prompt : ''} />}
            {state === PlayerState.RESULTS && <Results />}
        </>
    )
}
