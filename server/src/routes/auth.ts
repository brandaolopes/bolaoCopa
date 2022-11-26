import { FastifyInstance } from "fastify"
import Zod from "zod"
import { prisma } from "../lib/prisma"
import { autenthicate } from "../plugins/authenticate"


export async function authRoutes(fastify: FastifyInstance) {

    const fetch = require('node-fetch')

    fastify.get('/me', 
        {
            //midleware que vai definir quais rotas serão acessiveis só com autenticação
            onRequest: [autenthicate]
        },
        async (request) => {
        return { user: request.user }
    })


    fastify.post('/users', async (request, response) => {
        
        const createUserBody = Zod.object({
            access_token: Zod.string(),
        })
        
        const { access_token } = createUserBody.parse(request.body)

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${access_token}` }
        })

        const userData = await userResponse.json()

        const userInfoSchema = Zod.object({
            id: Zod.string(),
            email: Zod.string().email(),
            name: Zod.string(),
            picture: Zod.string().url(),
        })

        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture
                }
            })
        }


        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            sub: user.id,
            expiresIn: '7 days',
        })

        return token
    })
}