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

    //retorna todos os palpites que um usuario enviou dentro de um bolao
    fastify.get(`/pools/:poolId/participant/:participantId/guesses`, {
        onRequest: [autenthicate]
    } , async (request, reply) => {
        const createRequestParams = Zod.object({
            poolId: Zod.string(),
            participantId: Zod.string(),
        })

        const { poolId, participantId } = createRequestParams.parse(request.params)

        
        if (participantId === request.user.sub) {
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
    
            const participantGuesses = await prisma.guess.findMany({
                where: {
                    participantId: participant.id,
                }
            })
    
            return { participantGuesses }
        } else {
            return reply.status(400).send({
                message: 'It was not possible to find guesses'
            })
        }


    })

    //salva pontuação obtida para aquele palpite
    fastify.put(`/pools/`, {}, () => {}) 

}