import { io } from 'socket.io-client'
import { createContext } from 'react'

export class Api {
    constructor(url) {
        // console.log('Constructor')
        this.socket = io(url ? url : null)
    }

    getSocket() {
        return this.socket
    }

    setCode(code){
        this.code = code;
    }

    sendMessage(type, message) {
        const payload = { ...message, roomCode: this.code };
        // console.log('Send Message: type: ', type, ' Message: ', payload)
        this.socket.emit(type, payload)
    }

    //PLAYER SEND METHODS
    joinRoom(name, code) {
        this.sendMessage('join_room', { code: code, name: name })
    }

    hostStartGame() {
        this.sendMessage('host_start_game')
    }

    sendResponse(response) {
        this.sendMessage('player_prompt_response', {response})
    }

    vote(response) {
        this.sendMessage('player_submit_vote', {response})
    }

    //DISPLAY METHODS
    createRoom() {
        this.sendMessage('create_room')
    }
}

export const ApiContext = createContext()
