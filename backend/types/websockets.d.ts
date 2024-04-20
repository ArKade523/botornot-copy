export interface PlayerMap {
    [key: string]: Player // Key is the socket ID, value is the player's name
}

export interface Player {
    name: string
    id: string
    host: boolean
    responses: string[]
    points: number
}

export interface RoomMap {
    [key: string]: RoomData
}

export interface RoomData {
    displayID: string
    players: PlayerMap
    usedPrompts: number[]
    responses: responseVotes
}

export interface joinRoomPayload {
    name: string
    code: string
}

export interface responseVotes {
    [key: string]: { round: number; votes: number; player_id: string; isBot: boolean }
}

export interface joinRoomValidation {
    validCode: boolean
    validName: boolean
    host: boolean
}

export interface displayPlayerJoin {
    name: string
    host: boolean
}

export interface displayPromptResponse {
    player: string
    response: string
}
