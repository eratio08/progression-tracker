"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const services_1 = require("../services");
const async_1 = require("./async");
exports.authenticate = () => async_1.asyncWrap(async (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next();
        return;
    }
    const splitAuthHeader = authHeader.split("Bearer ");
    if (splitAuthHeader.length < 2) {
        throw new Error("Malformed authorization header.");
    }
    const jws = splitAuthHeader[1];
    let jwsToken;
    try {
        jwsToken = services_1.token.verify(jws);
    }
    catch (error) {
        throw new Error("Invalid token.");
    }
    const { sub, aud } = jwsToken;
    if (aud !== services_1.TokenType.Access) {
        throw new Error("Invalid token.");
    }
    const user = await typeorm_1.getRepository(entities_1.User).findOne(sub.id);
    if (!user) {
        throw new Error("User not found.");
    }
    req.authUser = user;
    next();
});
