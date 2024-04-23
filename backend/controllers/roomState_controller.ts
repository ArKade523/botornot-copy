import { Router } from 'express'
import { RoomStateManager } from '../repositories/roomState_repository'

export const roomStateController = () => {
    const router = Router()
    const roomStateManager = RoomStateManager.getInstance()

    return router
}
