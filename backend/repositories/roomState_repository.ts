import { Player, Response, RoomState } from "../types/types";

export class RoomStateManager {
    private static instance: RoomStateManager;
    private rooms: Record<string, RoomState>;

    private constructor() {
        this.rooms = {};
    }

    public static getInstance(): RoomStateManager {
        if (!RoomStateManager.instance) {
            RoomStateManager.instance = new RoomStateManager();
        }
        return RoomStateManager.instance;
    }

    public getRoomState(roomId: string): RoomState | undefined {
        return this.rooms[roomId];
    }

    public getRoomCodes(): string[] {
        return Object.keys(this.rooms);
    }

    public getUsedPrompts(roomId: string): number[] | undefined {
        return this.rooms[roomId]?.usedPrompts;
    }

    public setRoomState(roomId: string, state: RoomState): boolean {
        this.rooms[roomId] = state;
        return true;
    }

    public addPlayerToRoom(roomId: string, player: Player): boolean {
        if (this.rooms[roomId]) {
            this.rooms[roomId].players[player.id] = player;
            return true
        }

        return false;
    }

    public removePlayerFromRoom(roomId: string, playerId: string): boolean {
        if (this.rooms[roomId]) {
            delete this.rooms[roomId].players[playerId];
            return true;
        }

        return false;
    }

    public addResponseToPlayer(roomId: string, playerId: string, response: Response): boolean {
        if (this.rooms[roomId]) {
            this.rooms[roomId].players[playerId].responses.push(response);
            return true;
        }

        return false;
    }
} 
