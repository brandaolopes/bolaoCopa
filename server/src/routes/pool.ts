import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import Zod from "zod"
import { prisma } from "../lib/prisma"

export async function poolRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()
         return {count}
     })

     fastify.post('/pools', async (request, reply) => {

        const createPoolBody = Zod.object({
            title: Zod.string(),
        })
        const { title } = createPoolBody.parse(request.body)

        const generateCode = new ShortUniqueId({ length: 6 })
        const code = String(generateCode()).toUpperCase()

        await prisma.pool.create({
            data: {
                title,
                code, 
            }
        })

        return reply.status(201).send({ code })
        
    })
}