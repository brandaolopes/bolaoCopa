"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolRoutes = void 0;
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const authenticate_1 = require("../plugins/authenticate");
async function poolRoutes(fastify) {
    fastify.get('/pools/count', async () => {
        const count = await prisma_1.prisma.pool.count();
        return { count };
    });
    //criar bolao
    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = zod_1.default.object({
            title: zod_1.default.string(),
        });
        const { title } = createPoolBody.parse(request.body);
        const generateCode = new short_unique_id_1.default({ length: 6 });
        const code = String(generateCode()).toUpperCase();
        try {
            //se o usuário está autenticado (no app)
            await request.jwtVerify();
            await prisma_1.prisma.pool.create({
                data: {
                    title,
                    code,
                    ownerId: request.user.sub,
                    participants: {
                        create: {
                            userId: request.user.sub,
                        }
                    }
                }
            });
        }
        catch {
            //se usuario na web
            await prisma_1.prisma.pool.create({
                data: {
                    title,
                    code,
                }
            });
        }
        return reply.status(201).send({ code });
    });
    //entrar em um bolao fornecendo o código
    fastify.post('/pools/join', {
        onRequest: [authenticate_1.autenthicate]
    }, async (request, reply) => {
        const joinPoolBody = zod_1.default.object({
            code: zod_1.default.string(),
        });
        const { code } = joinPoolBody.parse(request.body);
        const pool = await prisma_1.prisma.pool.findUnique({
            where: {
                code: code,
            },
            include: {
                participants: {
                    where: {
                        userId: request.user.sub,
                    }
                }
            }
        });
        if (!pool) {
            return reply.status(400).send({
                message: 'No pool found',
            });
        }
        if (pool.participants.length > 0) {
            return reply.status(400).send({
                message: "You've already joined this poll!",
            });
        }
        //se o bolão criado na web (não tem dono) o dono passa a ser o 1o usuario a entrar nele
        if (!pool.ownerId) {
            await prisma_1.prisma.pool.update({
                where: {
                    id: pool.id,
                },
                data: {
                    ownerId: request.user.sub,
                }
            });
        }
        await prisma_1.prisma.participant.create({
            data: {
                poolId: pool.id,
                userId: request.user.sub,
            }
        });
        return reply.status(201).send({
            message: `${pool.title}`
        });
    });
    //encontra boloes onde o usuario logado é participante
    fastify.get('/pools', {
        onRequest: [authenticate_1.autenthicate]
    }, async (request) => {
        const pools = await prisma_1.prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: request.user.sub,
                    }
                }
            },
            //inclui o dono do bolao e qnts participantes tem nele
            include: {
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        },
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        });
        return { pools };
    });
    //visualizar informacoes do bolao
    fastify.get('/pools/:id', {
        onRequest: [authenticate_1.autenthicate]
    }, async (request) => {
        const getPoolParams = zod_1.default.object({
            id: zod_1.default.string(),
        });
        const { id } = getPoolParams.parse(request.params);
        const pool = await prisma_1.prisma.pool.findUnique({
            where: {
                id: id,
            },
            //inclui o dono do bolao e qnts participantes tem nele
            include: {
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        },
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        });
        return { pool };
    });
}
exports.poolRoutes = poolRoutes;
