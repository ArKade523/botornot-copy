import { io } from 'socket.io-client'
import { createContext } from 'react'
import { RoomState, Response } from '../types/types'

const NUM_ROUNDS = 3

export class Api {
    private socket: any
    roomState: RoomState = {
        roomCode: '',
        players: {},
        displayID: '',
        hostID: '',
        usedPrompts: [],
        round: 0,
        responses: []
    }
    private listeners: (() => void)[] = []

    constructor(url: string | null = null) {
        // console.log('Constructor')
        this.socket = io(url || '')

        this.socket.on('display_code', ({ roomCode }: { roomCode: string }) => {
            Object.assign(this.roomState, { roomCode })
            this.notify()
        })

        this.socket.on('player_joined', ({ players }: { players: Record<string, any> }) => {
            for (const player in players) {
                if (players[player].host) {
                    Object.assign(this.roomState, { hostID: players[player].id })
                }
            }
            this.roomState.players = players
            this.notify()
            console.log('Player Joined: ', players)
        })

        this.socket.on('bot_response', ({ response }: { response: string }) => {
            const botPlayer = Object.values(this.roomState.players).find((player) => player.isBot)
            if (!botPlayer) {
                const newBotPlayer = {
                    id: 'bot',
                    name: 'bot',
                    host: false,
                    responses: [],
                    points: 0,
                    isBot: true
                }
                this.roomState.players['bot'] = newBotPlayer
            }

            const botResponse: Response = {
                response,
                playerID: 'bot',
                votes: 0,
                round: this.roomState.round
            }

            this.roomState.responses.push(botResponse)
            this.notify()
        })

        this.socket.on(
            'response_submitted',
            ({ response, playerID }: { response: string; playerID: string }) => {
                const newResponse: Response = {
                    response,
                    playerID: playerID,
                    votes: 0,
                    round: this.roomState.round
                }
                console.log('Response Submitted: ', newResponse)

                this.roomState.responses.push(newResponse)
                this.notify()
            }
        )

        this.socket.on('vote_submitted', ({ response }: { response: string; playerID: string }) => {
            const responseIndex = this.roomState.responses.findIndex((r) => r.response === response)
            this.roomState.responses[responseIndex].votes++
            if (this.roomState.responses.every((r) => r.votes === Object.keys(this.roomState.players).length - 1)) {
                this.sendMessage('all_votes_submitted')
            }
            this.notify()
        })
    }

    destructor() {
        this.socket.disconnect()
    }

    private notify() {
        this.listeners.forEach((listener) => listener())
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener)
    }

    unsubscribe(listener: () => void) {
        this.listeners = this.listeners.filter((l) => l !== listener)
    }

    getSocket() {
        return this.socket
    }

    setRoomCode(code: string) {
        this.roomState.roomCode = code
    }

    isHost() {
        return this.roomState.hostID === this.socket.id
    }

    isDisplay() {
        return this.roomState.displayID === this.socket.id
    }

    isLastRound() {
        return this.roomState.round === NUM_ROUNDS
    }

    sendMessage(type: string, message: any = {}) {
        const payload = { ...message, roomCode: this.roomState.roomCode }
        console.log('Send Message: type: ', type, ' Message: ', payload)
        this.socket.emit(type, payload)
    }

    getPrompt() {
        this.sendMessage('get_prompt')
    }

    getResponseStrings(): string[] {
        // return the responses for this round only
        return this.roomState.responses
            .filter((response) => response.round === this.roomState.round)
            .map((response) => response.response).sort()
    }

    //PLAYER SEND METHODS
    joinRoom(name: string, code: string) {
        this.setRoomCode(code.toUpperCase())
        this.sendMessage('join_room', { name: name })
    }

    startGame() {
        this.sendMessage('start_game')
    }

    nextRound() {
        this.roomState.round++
        this.sendMessage('get_prompt')
    }

    submitResponse(response: string) {
        this.sendMessage('submit_response', { response })
    }

    vote(response: string) {
        this.sendMessage('submit_vote', { response })
    }

    finish() {
        this.sendMessage('finish')
    }

    //DISPLAY METHODS
    createRoom() {
        this.sendMessage('create_room')
    }
}

export const ApiContext = createContext<Api | null>(null)
