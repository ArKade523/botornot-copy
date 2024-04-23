import { RoomStateManager } from "../repositories/roomState_repository"
import prompts from "./prompts"

export const getPrompt = (roomCode: string) => {
    const roomStateManager = RoomStateManager.getInstance()

    let index = Math.floor(Math.random() * prompts.length)

    if (roomStateManager.getRoomCodes().includes(roomCode)) {
        while (roomStateManager.getUsedPrompts(roomCode)?.includes(index)) {
            index = Math.floor(Math.random() * prompts.length)
        }

        roomStateManager.getRoomState(roomCode)?.usedPrompts.push(index)

        return prompts[index]
    }
    
    console.error('Room code not found in getPrompt')

    return ''
}