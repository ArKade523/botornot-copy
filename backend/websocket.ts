import { IncomingMessage, Server, ServerResponse } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import prompts from './prompts'
import { requestGPTResponse } from './chatGPT'
import {
    RoomMap,
    displayPlayerJoin,
    displayPromptResponse,
    joinRoomPayload,
    joinRoomValidation
} from './types/websockets'

const setupWebSocket = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    const io = new SocketIOServer(server)
    const roomHosts: RoomMap = {}
    const numRounds = 1
    let roundNum = 0
    let numVotes = 0

    // Generate a random prompt from the list
    const generatePrompt = (roomCode: string) => {
        console.log(`Room code used in generatePrompt: ${roomCode}`)
        let index = Math.floor(Math.random() * prompts.length)

        if (roomHosts[roomCode] && roomHosts[roomCode].usedPrompts) {
            while (roomHosts[roomCode].usedPrompts?.includes(index)) {
                index = Math.floor(Math.random() * prompts.length)
            }
        }
        if (!roomHosts[roomCode].usedPrompts) {
            roomHosts[roomCode].usedPrompts = []
        }
        roomHosts[roomCode].usedPrompts.push(index)

        return prompts[index]
    }

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)

        socket.on('create_room', () => {
            let roomCode = Math.random().toString(36).toUpperCase().slice(2, 6) // Generate a simple room code
            while (roomCode in roomHosts) {
                roomCode = Math.random().toString(36).toUpperCase().slice(2, 6)
            }

            socket.join(roomCode)
            roomHosts[roomCode] = {
                displayID: socket.id,
                players: {},
                usedPrompts: [],
                responses: {}
            } // Store the host's socket ID

            console.log("Created roomHost[roomCode]")

            io.to(roomCode).emit('display_code', { code: roomCode })

            console.log(`Room created with code: ${roomCode}, host ID: ${socket.id}`)
        })

        socket.on('join_room', (payload: joinRoomPayload) => {
            socket.join(payload.code)
            roomHosts[payload.code].players[socket.id] = {
                name: payload.name,
                id: socket.id,
                host: false,
                responses: [],
                points: 0
            }

            const responsePayload: joinRoomValidation = {
                validCode: payload.code in roomHosts,
                validName: payload.name !== '',
                host: Object.keys(roomHosts[payload.code].players).length === 1, // If there is only one player in the room, they are the host
                code: payload.code
            }

            if (responsePayload.host) {
                roomHosts[payload.code].players[socket.id].host = true
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

        socket.on('host_start_game', async (payload: {roomCode: string}) => {
            const roomCode = payload.roomCode
            roomHosts[roomCode].responses = {}
            io.to(roomCode).emit('game_started')
            const prompt = generatePrompt(roomCode)
            io.to(roomCode).emit('prompt', prompt)
            const gptResponse = await requestGPTResponse(prompt)
            if (gptResponse) {
                roomHosts[roomCode].responses[gptResponse] = {
                    round: roundNum,
                    votes: 0,
                    player_id: '0',
                    isBot: true
                }
            }

            if (roundNum < numRounds) {
                io.to(roomCode).emit('start_timer', { duration: 60 })
                setTimeout(() => {
                    io.to(roomCode).emit(
                        'player_reveal_responses',
                        Object.keys(roomHosts[roomCode].responses)
                    )

                    io.to(roomCode).emit('start_timer', { duration: 60 })
                    setTimeout(() => {
                        let responseArray: { response: string, votes: number, player: string }[] = [];

                        // Extracting data from the responses object
                        for (const [response, details] of Object.entries(roomHosts[roomCode].responses)) {
                            const playerID = roomHosts[roomCode].responses[response].player_id

                            responseArray.push({
                                response: response,
                                votes: details.votes,
                                player: playerID === "0" ? "Robot" : roomHosts[roomCode].players[playerID].name
                            });
                        }

                        io.to(roomCode).emit('display_votes', {
                            responses: responseArray
                        })
                    }, 15000)
                }, 15000)
                roundNum++
            } else {
                let playerScores: { player: string; points: number }[] = []

                for (const playerKey in roomHosts[roomCode].players) {
                    const player = roomHosts[roomCode].players[playerKey]
                    playerScores.push({ player: player.name, points: player.points })

                    // Send the final scores to the players
                    io.to(player.id).emit('player_final_score', {
                        points: player.points
                    })
                }

                io.to(roomCode).emit('display_final_scores', {
                    players: playerScores
                })
            }
        })

        socket.on('player_prompt_response', ({response, roomCode} : {response: string, roomCode: string}) => {
            roomHosts[roomCode].players[socket.id].responses.push(response)
            roomHosts[roomCode].responses[response] = {
                round: roundNum,
                votes: 0,
                player_id: socket.id,
                isBot: false
            }
            io.to(roomCode).emit('display_prompt_response', {
                player: roomHosts[roomCode].players[socket.id].name,
                response
            } as displayPromptResponse)
        })

        socket.on('player_submit_vote', ({response, roomCode} : {response: string, roomCode: string}) => {
            console.log(roomHosts[roomCode].responses)

            roomHosts[roomCode].responses[response].votes++
            if (roomHosts[roomCode].responses[response].isBot) {
                roomHosts[roomCode].players[socket.id].points += 200
            } else {
                roomHosts[roomCode].players[
                    roomHosts[roomCode].responses[response].player_id
                ].points += 100
            }
            if (numVotes === Object.keys(roomHosts[roomCode].players).length) {
                const responsesObject = roomHosts[roomCode].responses
                const responsesArray = Object.keys(responsesObject).map((key) => ({
                    response: key,
                    votes: responsesObject[key].votes
                }))

                io.to(roomCode).emit('display_votes', { responses: responsesArray })
                for (const playerID in Object.keys(roomHosts[roomCode].players)) {
                    io.to(playerID).emit('player_points', {
                        player: roomHosts[roomCode].players[playerID].name,
                        points: roomHosts[roomCode].players[playerID].points
                    })
                }
            }
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
