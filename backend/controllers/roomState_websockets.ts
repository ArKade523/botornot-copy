import { Server, IncomingMessage, ServerResponse } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { RoomStateManager } from '../repositories/roomState_repository'
import { RoomState } from '../types/types'
import { getPrompt } from '../utils/getPrompt'
import { requestGPTResponse } from '../utils/chatGPT'

enum POINTS {
    VOTED_FOR = 100,
    GUESSED_BOT = 200
}

export const setupWebSockets = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    const io = new SocketIOServer(server)
    const roomStateManager = RoomStateManager.getInstance()
    const roomCodeMap: Record<string, string> = {}

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)

        socket.on('create_room', () => {
            let roomCode = Math.random().toString(36).toUpperCase().slice(2, 6).replace('0', 'O') // Generate a random 4-character room code
            while (roomCode in roomStateManager.getRoomCodes()) {
                roomCode = Math.random().toString(36).toUpperCase().slice(2, 6).replace('0', 'O')
            }

            socket.join(roomCode)
            roomCodeMap[socket.id] = roomCode
            const roomState: RoomState = {
                roomCode,
                players: {},
                displayID: socket.id,
                hostID: '',
                round: 0,
                responses: [],
                usedPrompts: []
            }

            if (roomStateManager.setRoomState(roomCode, roomState)) {
                console.log(`Room created with code: ${roomCode}, host ID: ${socket.id}`)
                io.to(socket.id).emit('display_code', { roomCode: roomCode })
            } else {
                console.error(`Failed to create room with code: ${roomCode}`)
            }
        })

        socket.on('join_room', ({ roomCode, name }: { roomCode: string; name: string }) => {
            if (!name) {
                console.error(`User ${socket.id} tried to join room ${roomCode} without a name`)
                io.to(socket.id).emit('error', { message: 'Please enter a name' })
                return
            }

            roomCode.replace('0', 'O') // Replace 0 with O to reduce the chance of confusion

            if (!roomCode) {
                console.error(`User ${socket.id} tried to join room without a room code`)
                io.to(socket.id).emit('error', { message: 'Please enter a room code' })
                return
            }

            if (roomStateManager.getRoomCodes().includes(roomCode)) {
                socket.join(roomCode)
                roomCodeMap[socket.id] = roomCode
                console.log(`User ${socket.id} joined room ${roomCode}`)
                const roomState = roomStateManager.getRoomState(roomCode)
                if (!roomState) {
                    console.error(`Room ${roomCode} does not exist`)
                    return
                }

                const host = Object.keys(roomState.players).length === 0
                const newPlayer = {
                    name,
                    id: socket.id,
                    host: host,
                    responses: [],
                    points: 0,
                    isBot: false
                }

                roomState.players[socket.id] = newPlayer

                if (host) {
                    roomState.hostID = socket.id
                }

                io.to(socket.id).emit('join_code_valid')

                roomStateManager.setRoomState(roomCode, roomState)

                io.to(roomCode).emit('player_joined', { players: roomState.players })
            } else {
                console.error(`User ${socket.id} tried to join nonexistent room ${roomCode}`)
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
            }
        })

        socket.on('start_game', () => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(`User ${socket.id} tried to start game without being in a room`)
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            const roomState = roomStateManager.getRoomState(roomCode)
            if (!roomState) {
                console.error(
                    `User ${socket.id} tried to start game in nonexistent room ${roomCode}`
                )
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
                return
            }

            if (roomState.hostID !== socket.id) {
                console.error(
                    `User ${socket.id} tried to start game in room ${roomCode} without being the host`
                )
                io.to(socket.id).emit('error', { message: 'Only the host can start the game' })
                return
            }

            console.log(`User ${socket.id} started game in room ${roomCode}`)
            io.to(roomCode).emit('game_started')
        })

        socket.on('get_prompt', async () => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(`User ${socket.id} tried to get prompt without being in a room`)
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            const roomState = roomStateManager.getRoomState(roomCode)
            if (!roomState) {
                console.error(
                    `User ${socket.id} tried to get prompt in nonexistent room ${roomCode}`
                )
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
                return
            }

            const prompt = getPrompt(roomCode)
            io.to(roomCode).emit('display_prompt', { prompt })

            const botResponseString = await requestGPTResponse(prompt)

            if (!botResponseString) {
                console.error(`Failed to get bot response for prompt: ${prompt}`)
                io.to(socket.id).emit('error', { message: 'Failed to get bot response' })
                return
            }

            const botResponse = {
                playerID: 'bot',
                response: botResponseString,
                votes: 0,
                round: roomState.round
            }

            roomState.responses.push(botResponse)

            const botPlayer = roomState.players['bot']
            if (botPlayer) {
                botPlayer.responses.push(botResponse)
            } else {
                const newBotPlayer = {
                    name: 'bot',
                    id: 'bot',
                    host: false,
                    responses: [botResponse],
                    points: 0,
                    isBot: true
                }
                roomState.players['bot'] = newBotPlayer
            }

            io.to(roomCode).emit('bot_response', { response: botResponseString })
        })

        socket.on('countdown_seconds', ({ seconds }: { seconds: number }) => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(
                    `User ${socket.id} tried to send countdown seconds without being in a room`
                )
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            io.to(roomCode).emit('countdown_seconds', { seconds })
        })

        socket.on('stop_timer', () => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(`User ${socket.id} tried to stop timer without being in a room`)
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            console.log(`User ${socket.id} stopped timer in room ${roomCode}`)

            io.to(roomCode).emit('stop_timer')
        })

        socket.on('submit_response', ({ response }: { response: string }) => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(`User ${socket.id} tried to submit response without being in a room`)
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            if (!response) {
                console.error(`User ${socket.id} tried to submit an empty response`)
                io.to(socket.id).emit('error', { message: 'Please enter a response' })
                return
            }

            const roomState = roomStateManager.getRoomState(roomCode)
            if (!roomState) {
                console.error(
                    `User ${socket.id} tried to submit response in nonexistent room ${roomCode}`
                )
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
                return
            }

            const player = roomState.players[socket.id]
            if (!player) {
                console.error(
                    `User ${socket.id} tried to submit response without being in the room`
                )
                io.to(socket.id).emit('error', { message: 'You are not in this room' })
                return
            }

            const newResponse = {
                playerID: socket.id,
                response,
                votes: 0,
                round: roomState.round
            }

            player.responses.push(newResponse)
            roomState.responses.push(newResponse)

            if (!roomStateManager.setRoomState(roomCode, roomState)) {
                console.error(`Failed to update room state for room ${roomCode}`)
                io.to(socket.id).emit('error', { message: 'Failed to submit response' })
                return
            }

            io.to(roomState.displayID).emit('response_submitted', { playerID: player.id, response })
            console.log(`User ${socket.id} submitted response in room ${roomCode}`)
            io.to(roomCode).emit('player_response_submitted', { response })
        })

        socket.on('all_responses_submitted', () => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(
                    `User ${socket.id} tried to submit all responses without being in a room`
                )
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            const roomState = roomStateManager.getRoomState(roomCode)
            if (!roomState) {
                console.error(
                    `User ${socket.id} tried to submit all responses in nonexistent room ${roomCode}`
                )
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
                return
            }

            roomState.round++

            io.to(roomCode).emit('all_responses_submitted')
        })

        socket.on('submit_vote', ({ response }: { response: string }) => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(`User ${socket.id} tried to submit vote without being in a room`)
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            if (!response) {
                console.error(`User ${socket.id} tried to submit an empty vote`)
                io.to(socket.id).emit('error', { message: 'Please enter a vote' })
                return
            }

            const roomState = roomStateManager.getRoomState(roomCode)

            if (!roomState) {
                console.error(
                    `User ${socket.id} tried to submit vote in nonexistent room ${roomCode}`
                )
                io.to(socket.id).emit('error', { message: 'Room does not exist' })
                return
            }

            const player = roomState.players[socket.id]

            if (!player) {
                console.error(`User ${socket.id} tried to submit vote without being in the room`)
                io.to(socket.id).emit('error', { message: 'You are not in this room' })
                return
            }

            const responseObj = roomState.responses.find((r) => r.response === response)

            if (!responseObj) {
                console.error(`User ${socket.id} tried to submit vote for nonexistent response`)
                io.to(socket.id).emit('error', { message: 'Response does not exist' })
                return
            }

            responseObj.votes++
            const votedPlayer = roomState.players[responseObj.playerID]
            votedPlayer.points += POINTS.VOTED_FOR;
            console.log(`User ${socket.id} voted for response in room ${roomCode}`)

            player.points += responseObj.playerID === "bot" ? POINTS.GUESSED_BOT : 0
            
            io.to(socket.id).emit('vote_submitted', { response })
            io.to(roomState.displayID).emit('vote_submitted', { playerID: player.id, response })
        })

        socket.on('all_votes_submitted', () => {
            const roomCode = roomCodeMap[socket.id]
            if (!roomCode) {
                console.error(
                    `User ${socket.id} tried to submit all votes without being in a room`
                )
                io.to(socket.id).emit('error', { message: 'You are not in a room' })
                return
            }

            io.to(roomCode).emit('all_votes_submitted')
        })

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id)
            const roomCode = roomCodeMap[socket.id]
            if (roomCode) {
                const roomState = roomStateManager.getRoomState(roomCode)
                if (roomState) {
                    delete roomState.players[socket.id]
                    if (roomState.hostID === socket.id) {
                        const newHostID = Object.keys(roomState.players)[0]
                        if (newHostID) {
                            roomState.hostID = newHostID
                        }
                    }

                    roomStateManager.setRoomState(roomCode, roomState)
                    io.to(roomCode).emit('player_left', { players: roomState.players })
                }
            }
        })
    })

    return io
}
