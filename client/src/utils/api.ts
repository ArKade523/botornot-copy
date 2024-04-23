import { io } from 'socket.io-client'
import { createContext } from 'react'
import { RoomState } from '../types/types'


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
    private listeners: (() => void)[] = [];

    constructor(url: string | null = null) {
        // console.log('Constructor')
        this.socket = io(url || '')

        this.socket.on('display_code', ( { roomCode } : { roomCode: string } ) => {
            Object.assign(this.roomState, { roomCode })
            this.notify()
        })

        this.socket.on('player_joined', ( { players } : { players: Record<string, any> } ) => {
            for (const player in players) {
                if (players[player].host) {
                    Object.assign(this.roomState, { hostID: players[player].id })
                }
            }
            Object.assign(this.roomState, { players })
            this.notify()
            console.log('Player Joined: ', players)
        })

    }

    destructor() {
        this.socket.disconnect()
    }

    private notify() {
        this.listeners.forEach(listener => listener())
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener)
    }

    unsubscribe(listener: () => void) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    getSocket() {
        return this.socket
    }

    setRoomCode(code: string) {
        this.roomState.roomCode = code;
    }

    isHost() {
        return this.roomState.hostID === this.socket.id
    }

    sendMessage(type: string, message: any = {}) {
        const payload = { ...message, roomCode: this.roomState.roomCode };
        console.log('Send Message: type: ', type, ' Message: ', payload)
        this.socket.emit(type, payload)
    }

    getPrompt() {
        this.sendMessage('get_prompt')
    }

    //PLAYER SEND METHODS
    joinRoom(name: string, code: string) {
        this.setRoomCode(code.toUpperCase())
        this.sendMessage('join_room', { name: name })
    }

    startGame() {
        this.sendMessage('start_game')
    }

    submitResponse(response: string) {
        this.sendMessage('submit_response', {response})
    }

    vote(response: string) {
        this.sendMessage('submit_vote', {response})
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
