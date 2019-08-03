"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = __importDefault(require("envalid"));
const { str, email, num } = envalid_1.default;
const strHex64 = envalid_1.default.makeValidator(x => {
    if (/^[0-9a-f]{64}$/.test(x)) {
        return x;
    }
    throw new Error("Expected a hex-character string of length 64");
});
exports.config = envalid_1.default.cleanEnv(process.env, {
    JWT_SECRET: str(),
    JWT_ALGORITHM: str(),
    JWT_ISSUER: email(),
    HASH_ALGORITHM: str(),
    HASH_SALT_ROUNDS: num(),
    FRONTEND_URL: str(),
    ACCESS_TOKEN_COOKIE_NAME: str(),
    SECRET_HEX: strHex64()
});
