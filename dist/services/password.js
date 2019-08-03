"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
exports.hashPassword = async (password) => {
    const iterations = config_1.config.HASH_SALT_ROUNDS;
    const salt = await bcrypt_1.default.genSalt(iterations);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    return [hashedPassword, salt].join(":");
};
exports.verifyPassword = async (password, hash) => {
    const [hashedPassword, salt] = hash.split(":");
    const inputHashed = await bcrypt_1.default.hash(password, salt);
    return inputHashed === hashedPassword;
};
