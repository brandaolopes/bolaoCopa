import { FastifyRequest } from "fastify";


export async function autenthicate(request: FastifyRequest) {
    await request.jwtVerify()
}