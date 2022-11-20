"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const authenticate_1 = require("../plugins/authenticate");
async function authRoutes(fastify) {
    fastify.get('/me', {
        //midleware que vai definir quais rotas serão acessiveis só com autenticação
        onRequest: [authenticate_1.autenthicate]
    }, async (request) => {
        return { user: request.user };
    });
    fastify.post('/users', async (request, response) => {
        const createUserBody = zod_1.default.object({
            access_token: zod_1.default.string(),
        });
        const { access_token } = createUserBody.parse(request.body);
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const userData = await userResponse.json();
        const userInfoSchema = zod_1.default.object({
            id: zod_1.default.string(),
            email: zod_1.default.string().email(),
            name: zod_1.default.string(),
            picture: zod_1.default.string().url(),
        });
        const userInfo = userInfoSchema.parse(userData);
        let user = await prisma_1.prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        });
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture
                }
            });
        }
        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            sub: user.id,
            expiresIn: '7 days',
        });
        return token;
    });
}
exports.authRoutes = authRoutes;
