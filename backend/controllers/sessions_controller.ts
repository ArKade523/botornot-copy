import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// /sessions/...
export const buildSessionsController = (db: PrismaClient) => {
    const router = Router()

    router.post('/', async (req, res) => {
        const user = await db.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
            const token = jwt.sign(
                {
                    userId: user.id
                },
                process.env.ENCRYPTION_KEY as string
            )

            res.json({ token })
        } else {
            res.status(404).json({ error: 'Invalid email or password' })
        }
    })

    router.get('/logout', (req, res) => {
        res.json({ message: 'Logged out' })
    })

    router.post('/register', async (req, res) => {
        const user = await db.user.create({
            data: {
                email: req.body.email,
                password_hash: bcrypt.hashSync(req.body.password),
                Profile: {
                    create: {
                        first_name: req.body.firstName,
                        last_name: req.body.lastName
                    }
                }
            }
        })

        if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
            const token = jwt.sign(
                {
                    userId: user.id
                },
                process.env.ENCRYPTION_KEY as string
            )

            res.json({ token })
        } else {
            res.status(404).json({ error: 'Invalid email or password' })
        }
    })

    return router
}