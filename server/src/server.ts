import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from '@fastify/cors';
import Zod from 'zod';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstap() {

    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    //http://localhost:3333/
    fastify.get('/pools/count', async () => {
       const count = await prisma.pool.count()
        return {count}
    })

    fastify.get('/users/count', async () => {
        const count = await prisma.user.count()
         return {count}
     })

     fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()
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

    await fastify.listen({ port: 3333, /* host: '0.0.0.0' */ })
}

bootstap()