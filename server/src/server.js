"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const pool_1 = require("./routes/pool");
const user_1 = require("./routes/user");
const guess_1 = require("./routes/guess");
const game_1 = require("./routes/game");
const auth_1 = require("./routes/auth");
dotenv.config();
const prisma = new client_1.PrismaClient({
    log: ['query'],
});
async function bootstap() {
    const fastify = (0, fastify_1.default)({
        logger: true,
    });
    await fastify.register(cors_1.default, {
        origin: true,
    });
    // em produção deverá ser uma variável de ambiente
    await fastify.register(jwt_1.default, {
        secret: `${process.env.JWT_SECRET_KEY}`,
    });
    await fastify.register(pool_1.poolRoutes);
    await fastify.register(user_1.userRoutes);
    await fastify.register(guess_1.guessRoutes);
    await fastify.register(game_1.gameRoutes);
    await fastify.register(auth_1.authRoutes);
    //http://localhost:3333/
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}
bootstap();
