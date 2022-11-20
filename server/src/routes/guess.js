"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const authenticate_1 = require("../plugins/authenticate");
async function guessRoutes(fastify) {
    //conta o total de palpites
    fastify.get('/guesses/count', async () => {
        const count = await prisma_1.prisma.guess.count();
        return { count };
    });
    //envia um palpite
    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [authenticate_1.autenthicate]
    }, async (request, reply) => {
        const createGuessParams = zod_1.default.object({
            poolId: zod_1.default.string(),
            gameId: zod_1.default.string(),
        });
        const createGuessBody = zod_1.default.object({
            firstTeamPoints: zod_1.default.number(),
            secondTeamPoints: zod_1.default.number(),
        });
        const { poolId, gameId } = createGuessParams.parse(request.params);
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);
        const participant = await prisma_1.prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub,
                }
            }
        });
        if (!participant) {
            return reply.status(400).send({
                message: 'User do not participate of this poll',
            });
        }
        const guess = await prisma_1.prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId: gameId
                }
            }
        });
        if (guess) {
            return reply.status(400).send({
                message: "You've already sent a guess to this game on this poll",
            });
        }
        const game = await prisma_1.prisma.game.findUnique({
            where: {
                id: gameId
            }
        });
        if (!game) {
            return reply.status(400).send({
                message: "Game not found!",
            });
        }
        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send guesses for this game anymore. Time is out!",
            });
        }
        await prisma_1.prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }
        });
        return reply.status(201).send();
    });
    //retorna soma da pontuação de todos os palpites que os usuarios enviaram dentro de um bolao
    fastify.get(`/pools/:poolId/participants/guesses`, {
        onRequest: [authenticate_1.autenthicate]
    }, async (request, reply) => {
        const createRequestParams = zod_1.default.object({
            poolId: zod_1.default.string(),
        });
        const { poolId } = createRequestParams.parse(request.params);
        const pool = await prisma_1.prisma.pool.findUnique({
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
        });
        return pool;
    });
    //salva pontuação obtida para um palpite
    fastify.put(`/guess/:id`, {
        onRequest: [authenticate_1.autenthicate]
    }, async (request, reply) => {
        const createGuessParams = zod_1.default.object({
            id: zod_1.default.string(),
        });
        const createGuessBody = zod_1.default.object({
            guessResultPoints: zod_1.default.number(),
        });
        const { id } = createGuessParams.parse(request.params);
        const { guessResultPoints } = createGuessBody.parse(request.body);
        await prisma_1.prisma.guess.update({
            where: {
                id: id
            },
            data: {
                guessResultPoints: guessResultPoints
            }
        });
        return reply.status(201).send();
    });
}
exports.guessRoutes = guessRoutes;
