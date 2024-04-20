import { IncomingMessage, Server, ServerResponse } from 'http'
import { Server as SocketIOServer } from 'socket.io'

interface PlayerMap {
    [key: string]: string
}

interface RoomMap {
    [key: string]: { displayID: string; players: PlayerMap }
}

interface joinRoomPayload {
    name: string
    code: string
}

interface joinRoomValidation {
    validCode: boolean
    validName: boolean
    host: boolean
}

interface displayPlayerJoin {
    name: string
    host: boolean
}

const setupWebSocket = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    const io = new SocketIOServer(server)
    const roomHosts: RoomMap = {}

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)

        socket.on('create_room', () => {
            let roomCode = Math.random().toString(36).toUpperCase().slice(2, 6) // Generate a simple room code
            while (roomCode in roomHosts) {
                roomCode = Math.random().toString(36).toUpperCase().slice(2, 6)
            }
            socket.join(roomCode)
            roomHosts[roomCode] = { displayID: socket.id, players: {} } // Store the host's socket ID

            console.log(`Room created with code: ${roomCode}, host ID: ${socket.id}`)
        })

        socket.on('join_room', (payload: joinRoomPayload) => {
            socket.join(payload.code)
            roomHosts[payload.code].players[socket.id] = payload.name

            const responsePayload: joinRoomValidation = {
                validCode: payload.code in roomHosts,
                validName: payload.name !== '',
                host: Object.keys(roomHosts[payload.code].players).length === 1 // If there is only one player in the room, they are the host
            }

            io.to(socket.id).emit('join_room_validation', responsePayload)
            if (responsePayload.validCode && responsePayload.validName) {
                const displayPayload: displayPlayerJoin = {
                    name: payload.name,
                    host: responsePayload.host
                }

                io.to(roomHosts[payload.code].displayID).emit('display_player_join', displayPayload)
                
                console.log(`Player ${socket.id} joined room: ${payload.code}`)
            }

        })

        socket.on('host_start_game', (roomCode: string) => {
            io.to(roomCode).emit('game_started')
        })

        socket.on('player_submit_vote', (response: string) => {
            // TODO
        })

        socket.on('player_prompt_response', (payload: any) => {

            socket.emit('display_prompt_response', {
                ...payload,
                name: roomHosts[payload.code].players[socket.id]
            })
        })

        socket.on('display_reveal_responses', (payload: any) => {
            // TODO
        })

        socket.on('player_reveal_responses', (payload: any) => {
            // TODO
        })

        socket.on('disconnect', () => {
            // On disconnect, remove the socket ID from roomHosts if they are a host
            Object.keys(roomHosts).forEach((roomCode) => {
                if (roomHosts[roomCode].displayID === socket.id) {
                    io.to(roomCode).emit('display_disconnected')
                    delete roomHosts[roomCode]
                    console.log(`Host ${socket.id} disconnected, room ${roomCode} is deleted`)
                }
            })
            console.log('User disconnected:', socket.id)
        })
    })

    return io
}

export default setupWebSocket
