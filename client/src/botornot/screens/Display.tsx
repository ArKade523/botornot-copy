import { useEffect, useState } from 'react'
import Players from '../components/Players'
import { useApi } from '../../hooks/useApi'
import { Player } from '../types/types'
import Introduction from './Introduction'
import Submitted from './Submitted'
import Vote from './Vote'
import Results from './Results'

enum DisplayState {
    JOIN,
    INTRODUCTION,
    PROMPT,
    VOTE,
    RESULTS
}

function Display() {
    const api = useApi()
    const socket = api?.getSocket()
    const [state, setState] = useState(DisplayState.JOIN)
    const [players, setPlayers] = useState<Player[] | undefined>(undefined)
    const [roomCode, setRoomCode] = useState<string | undefined>(undefined)
    const [prompt, setPrompt] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (api) {
            setPlayers(Object.values(api.roomState.players))
            setRoomCode(api.roomState.roomCode)
        }
    }, [api, api?.roomState.players, api?.roomState.roomCode])

    useEffect(() => {
        if (socket) {
            socket.on('game_started', () => {
                setState(DisplayState.INTRODUCTION)
            })

            socket.on('display_prompt', ({ prompt }: { prompt: string }) => {
                setState(DisplayState.PROMPT)
                setPrompt(prompt)
            })

            socket.on('all_responses_submitted', () => {
                setState(DisplayState.VOTE)
            })

            socket.on('all_votes_submitted', () => {
                setState(DisplayState.RESULTS)
            })
        }

        return () => {
            socket?.off('game_started')
            socket?.off('display_prompt')
            socket?.off('all_responses_submitted')
            socket?.off('all_votes_submitted')
        }
    }, [socket])

    return (
        <>
            {state === DisplayState.JOIN && (
                <div className="join-content">
                    <div className="persons">
                        {players?.length === 0 && <p className="medium-info">No Players</p>}
                        <Players players={players}></Players>
                    </div>
                    <div className="join-info">
                        <p className="small-info">
                            In this game, you will all respond to prompts pretending to be bots. One
                            of the responses will be from a real bot. Earn points by fooling your
                            friends and finding the actual bot.
                        </p>

                        <p className="small-info">
                            Go to domain and click Join Game. Enter the code when prompted
                        </p>
                        <p className="join-code">{roomCode}</p>
                    </div>
                </div>
            )}
            {state === DisplayState.INTRODUCTION && <Introduction />}
            {state === DisplayState.PROMPT && (
                <>
                    <Submitted prompt={prompt ? prompt : ''} />
                </>
            )}
            {state === DisplayState.VOTE && <Vote prompt={prompt ? prompt : ''} />}
            {state === DisplayState.RESULTS && <Results />}
        </>
    )
}

export default Display
