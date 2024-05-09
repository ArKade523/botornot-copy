import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

export type CreateUserPayload = {
    email: string
    password: string
    firstName: string
    lastName: string
}

export class UsersRepository {
    private db: PrismaClient
    private static instance: UsersRepository
    constructor(db: PrismaClient) {
        this.db = db
    }

    static getInstance(db?: PrismaClient): UsersRepository {
        if (!this.instance) {
            this.instance = new UsersRepository(db!!)
        }
        return this.instance
    }

    async createUser({ email, password, firstName, lastName }: CreateUserPayload) {
        return this.db.user.create({
            data: {
                email: email,
                password_hash: bcrypt.hashSync(password),
                Profile: {
                    create: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            }
        })
    }

    async getUserById(id: number) {
        return this.db.user.findUnique({
            where: {
                id: id
            },
            include: {
                Profile: true
            }
        })
    }
}
