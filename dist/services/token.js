"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jose_1 = require("@panva/jose");
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const random_1 = require("./random");
const secretBuffer = Buffer.from(config_1.config.SECRET_HEX, "hex");
const jwk = jose_1.JWK.asKey(secretBuffer);
/**
 * Token types.
 */
var TokenType;
(function (TokenType) {
    TokenType["Access"] = "Access";
    TokenType["SignUp"] = "SignUp";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
exports.token = {
    /**
     * Generates a new token.
     * @param claims
     */
    newToken(subject, audience, expireMinutes) {
        return {
            sub: subject,
            aud: audience,
            iat: moment_1.default().unix(),
            exp: moment_1.default()
                .add(expireMinutes, "minutes")
                .unix(),
            iss: config_1.config.JWT_ISSUER,
            jti: random_1.random.secureId()
        };
    },
    /**
     * Signs a given token. (JWS)
     * @param token the token
     */
    sign(token) {
        return jose_1.JWS.sign(token, jwk, { alg: "HS512" });
    },
    /**
     * Verifies a given signature. (JWS)
     * @param payload the signed payload
     */
    verify(jws) {
        return jose_1.JWS.verify(jws, jwk);
    },
    /**
     * Encrypt a given token. (JWE)
     * @param token the token
     */
    encrypt(token) {
        return jose_1.JWE.encrypt(Buffer.from(JSON.stringify(token)), jwk);
    },
    /**
     * Decrypt an encrypted token. (JWE)
     * @param jwe the encrypted payload
     */
    decrypt(jwe) {
        const payload = jose_1.JWE.decrypt(jwe, jwk);
        return JSON.parse(payload.toString("utf8"));
    }
};
