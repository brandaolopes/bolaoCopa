import { FastifyInstance } from "fastify"
import Zod from "zod"
import { prisma } from "../lib/prisma"
import { autenthicate } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
        //conta o total de palpites
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()
         return {count}
     })

        //envia um palpite
    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [autenthicate]
     }, async (request, reply) => {
        const createGuessParams = Zod.object({
            poolId: Zod.string(),
            gameId: Zod.string(),
        })

        const createGuessBody = Zod.object({
            firstTeamPoints: Zod.number(),
            secondTeamPoints: Zod.number(),
        })

        const { poolId, gameId } = createGuessParams.parse(request.params)

        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)


        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub,
                }
            }
        })

        if (!participant) {
            return reply.status(400).send({
                message: 'User do not participate of this poll',
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId: gameId
                }
            }
        })

        if (guess) {
            return reply.status(400).send({
                message: "You've already sent a guess to this game on this poll",
            })
        }


        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        })

        if (!game) {
            return reply.status(400).send({
                message: "Game not found!",
            })
        }

        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send guesses for this game anymore. Time is out!",
            })
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }
        })


        return reply.status(201).send();

     })

    //retorna soma da pontuação de todos os palpites que os usuarios enviaram dentro de um bolao
    fastify.get(`/pools/:poolId/participants/guesses`, {
        onRequest: [autenthicate]
    } , async (request, reply) => {
        const createRequestParams = Zod.object({
            poolId: Zod.string(),
            
        })

        const { poolId } = createRequestParams.parse(request.params)
        
        const pool = await prisma.pool.findUnique({
            where: {
                id: poolId,
            },
            //inclui dados dos participantes
            include: {
                participants: {
                    select: {
                        id: true,

                        user: {
                            select: {
                                avatarUrl: true,
                                name: true,
                            }
                        },

                        guesses: {
                            select: {
                                guessResultPoints: true,

                            },
                        }
                    },

                },
            }

        })

        return pool 


    })

    //salva pontuação obtida para um palpite
    fastify.put(`/guess/:id`, {
        onRequest: [autenthicate]
    }, async (request, reply) => {
        const createGuessParams = Zod.object({
            id: Zod.string(),
        })

        const createGuessBody = Zod.object({
            guessResultPoints: Zod.number(),
        })

        const { id } = createGuessParams.parse(request.params)

        const { guessResultPoints } = createGuessBody.parse(request.body)

        await prisma.guess.update({
            where: {
                id: id
            },
            data: {
                guessResultPoints: guessResultPoints
            }
        })

        return reply.status(201).send();
    }) 

}