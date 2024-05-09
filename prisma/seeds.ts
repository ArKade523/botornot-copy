import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
import { config } from 'dotenv'
config()

async function main() {
    // TODO: put default data in the database
    const user = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            email: 'kade.angell@usu.edu',
            password_hash: bcrypt.hashSync('test'),
            Profile: {
                create: {
                    first_name: 'Kade',
                    last_name: 'Angell'
                }
            }
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
