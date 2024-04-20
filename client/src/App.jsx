import { useState, useEffect } from 'react'
import './App.css'
import Display from './screens/Display'
import Introduction from './screens/Introduction'
import Submitted from './screens/Submitted'
import Guess from './screens/Guess'
import Awnsers from './screens/Awnsers'
import Scores from './screens/Scores'
import { useApi } from './hooks/useApi'

function App() {
    const [mode, setMode] = useState('start')
    const [isDisplay, setIsDisplay] = useState(false)
    const api = useApi('localhost:3000')

    const [code, setCode] = useState(undefined)
    const [players, setPlayers] = useState([])
    const [responses, setResponses] = useState([])
    const [host, setHost] = useState(false)
    const [promp, setPromp] = useState('')
    const [votes, setVotes] = useState([])
    const [scores, setScores] = useState([])
    const [points, setPoints] = useState(0)

    useEffect(() => {
        socket = api.getSocket()

        socket.on('display_code', (res) => {
            console.log(res.code)
            setCode(res.code)
        })

        socket.on('display_player_join', (res) => {
            console.log(res)
            setPlayers((players) => [...players, res.name])
        })

        socket.on('game_started', () => {
            console.log('Game Started')
            setMode('introduction')
        })

        socket.on('prompt', (res) => {
            console.log(res)
            setPromp(res.prompt)
            if (isDisplay) {
                setMode('submitted')
                setPlayers([])
            } else {
                setMode('enter')
            }
        })

        socket.on('start_timer', () => {
            console.log('Start Timer')
            //Start a timer
        })

        socket.on('display_prompt_response', (res) => {
            console.log(res)
            setPlayers((players, res) => {
                ;[...players, { player: res.player, response: res.response }]
            })
        })

        socket.on('display_reveal_responses', (res) => {
            console.log(res)
            setMode('guess')
            setPlayers((players, res) => {
                ;[...players, { player: bot, response: res.bot_response }]
            })
        })

        socket.on('display_votes', (res) => {
            console.log(res)
            //Make this interactive??
        })

        socket.on('display_final_scores', (res) => {
            console.log(res)
            setMode('scores')
            setScores(res)
        })

        //Player Screen
        socket.on('join_room', (res) => {
            console.log(res)
        })

        socket.on('join_room_validation', (res) => {
            console.log(res)
            setHost(res.host)
            setMode('host')
        })

        socket.on('player_reveal_responses', (res) => {
            console.log(res)
            setMode('choose')
            setResponses(res)
        })

        socket.on('player_points', (res) => {
            console.log(res)
            setMode('points')
            setPoints((points) => points + res.points)
        })

        socket.on('display_final_scores', (res) => {
            console.log(res)
            setMode('scores')
            setScores(res)
        })
    }, [])

    return (
        <>
            <div id="logo-div">
                <h1>Bot or Not</h1>
            </div>
            {mode === 'start' && (
                <div className="choose-display">
                    <button
                        onClick={() => {
                            setMode('display')
                            setIsDisplay(true)
                            api.createRoom()
                        }}
                    >
                        Create Game
                    </button>
                    <button
                        onClick={() => {
                            setMode('join')
                        }}
                    >
                        Join Game
                    </button>
                </div>
            )}
            {mode === 'display' && <Display code={code} players={players}></Display>}
            {mode === 'introduction' && <Introduction></Introduction>}
            {mode === 'submitted' && <Submitted prompt={promp} players={players}></Submitted>}
            {mode === 'guess' && <Guess prompt={promp} players={players}></Guess>}
            {mode === 'awnsers' && <Awnsers prompt={promp} players={players}></Awnsers>}
            {mode === 'scores' && <Scores players={players}></Scores>}

            {mode === 'join' && <Join api={api}></Join>}
            {mode === 'host' && <Host></Host>}
            {mode === 'enter' && <Enter promp={promp} api={api} setMode={setMode}></Enter>}
            {mode === 'wait' && <h1>WAIT!</h1>}
            {mode === 'choose' && (
                <Choose prompt={promp} responses={responses} api={api} setMode={setMode}></Choose>
            )}
            {mode === 'points' && <h2>Your points {points}</h2>}
        </>
    )
}

export default App
