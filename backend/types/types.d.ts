export interface RoomState {
    roomCode: string
    players: Record<string, Player>
    displayID: string
    hostID: string
    usedPrompts: number[]
    round: number
    responses: Response[]
}

export interface Player {
    name: string
    id: string
    host: boolean
    responses: Response[]
    points: number
    isBot: boolean
}

export interface Response {
    playerID: string
    response: string
    votes: number
    round: number
}
