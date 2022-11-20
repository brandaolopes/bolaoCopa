"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenthicate = void 0;
async function autenthicate(request) {
    await request.jwtVerify();
}
exports.autenthicate = autenthicate;
