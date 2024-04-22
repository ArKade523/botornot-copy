import { io } from 'socket.io-client'
import { createContext } from 'react'
import { RoomState } from '../types/types'


export class Api {
    private socket: any
    private roomState: RoomState

    constructor(url: string | null = null) {
        // console.log('Constructor')
        this.socket = io(url || '')
        this.roomState = {
            roomCode: '',
            players: {},
            displayID: '',
            hostID: '',
            usedPrompts: [],
            round: 0,
            responses: []
        }
    }

    getSocket() {
        return this.socket
    }

    setRoomCode(code: string) {
        this.roomState.roomCode = code;
    }

    sendMessage(type: string, message: any = {}) {
        const payload = { ...message, roomCode: this.roomState.roomCode };
        console.log('Send Message: type: ', type, ' Message: ', payload)
        this.socket.emit(type, payload)
    }

    //PLAYER SEND METHODS
    joinRoom(name: string, code: string) {
        this.setRoomCode(code)
        this.sendMessage('join_room', { name: name })
    }

    hostStartGame() {
        this.sendMessage('host_start_game')
    }

    sendResponse(response: string) {
        this.sendMessage('player_prompt_response', {response})
    }

    vote(response: string) {
        this.sendMessage('player_submit_vote', {response})
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
