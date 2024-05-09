import { Router } from 'express'
import * as bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { UsersRepository } from '../repositories/users_repository'
import { authMiddleware } from '../middleware/authentication'
import * as jwt from 'jsonwebtoken'

// /users/...
export const buildUsersController = (usersRepository: UsersRepository) => {
    const router = Router()

    router.post('/', async (req, res) => {
        const user = await usersRepository.createUser(req.body)

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.ENCRYPTION_KEY as string
        )

        res.json({ user, token })
    })

    router.get('/me', authMiddleware, async (req, res) => {
        const user = await usersRepository.getUserById(req.user?.id as number)

        res.json({ user })
    })

    return router
}
