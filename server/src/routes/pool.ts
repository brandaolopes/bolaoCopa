import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import Zod from "zod"
import { prisma } from "../lib/prisma"
import { autenthicate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
        fastify.get('/pools/count', async () => {
            const count = await prisma.pool.count()
            return {count}
        })

        //criar bolao
        fastify.post('/pools', async (request, reply) => {

            const createPoolBody = Zod.object({
                title: Zod.string(),
            })
            const { title } = createPoolBody.parse(request.body)

            const generateCode = new ShortUniqueId({ length: 6 })
            const code = String(generateCode()).toUpperCase()

            try {
                //se o usuário está autenticado (no app)
                await request.jwtVerify()
                await prisma.pool.create({
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
                })

            } catch {
                //se usuario na web
                await prisma.pool.create({
                    data: {
                        title,
                        code, 
                    }
                })
            }

            

            return reply.status(201).send({ code })
        
        })

        //entrar em um bolao fornecendo o código
        fastify.post('/pools/join', {
            onRequest: [autenthicate]
        }, async (request, reply) => {
            const joinPoolBody = Zod.object({
                code: Zod.string(),
            })

            const { code } = joinPoolBody.parse(request.body)

            const pool = await prisma.pool.findUnique({
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
            })

            if (!pool) {
                return reply.status(400).send({
                    message: 'No pool found',
                })
            }

            if (pool.participants.length > 0) {
                return reply.status(400).send({
                    message: "You've already joined this poll!",
                })
            }

            //se o bolão criado na web (não tem dono) o dono passa a ser o 1o usuario a entrar nele
            if (!pool.ownerId) {
                await prisma.pool.update({
                    where: {
                        id: pool.id,
                    }, 
                    data: {
                        ownerId: request.user.sub,
                    }
                })
            }

            await prisma.participant.create({
                data: {
                    poolId: pool.id,
                    userId: request.user.sub,
                }
            })

            return reply.status(201).send()

        })

        //encontra boloes onde o usuario logado é participante
        fastify.get('/pools', {
            onRequest: [autenthicate]
        }, async (request) => {
            const pools = await prisma.pool.findMany({
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

            })

            return { pools }
        })

        //visualizar informacoes do bolao
        fastify.get('pools/:id', {
            onRequest: [autenthicate]
        }, async (request) => {
            const getPoolParams = Zod.object({
                id: Zod.string(),
            })

            const { id } = getPoolParams.parse(request.params)

            const pool = await prisma.pool.findUnique({
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

            })

            return { pool }

        })
}