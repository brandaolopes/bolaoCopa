"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John',
            email: 'john.doe@example.com',
            avatarUrl: 'https://github.com/brandaolopes.png'
        }
    });
    const pool = await prisma.pool.create({
        data: {
            title: 'Bolão de teste',
            code: 'BOL123',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id
                }
            }
        },
    });
    await prisma.game.create({
        data: {
            date: '2022-11-24T16:00:00.201Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    });
    await prisma.game.create({
        data: {
            date: '2022-11-28T13:00:00.201Z',
            firstTeamCountryCode: 'SW',
            secondTeamCountryCode: 'BR',
            guesses: {
                create: {
                    firstTeamPoints: 3,
                    secondTeamPoints: 1,
                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        }
    });
}
main();
