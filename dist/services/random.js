"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base64url_1 = __importDefault(require("base64url"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const counter = {
    state: createRandomBytes(32).readUInt32BE(0) % Number.MAX_SAFE_INTEGER,
    getAndIncrement() {
        const v = this.state;
        if (this.state === Number.MAX_SAFE_INTEGER) {
            this.state = Number.MIN_SAFE_INTEGER;
        }
        else {
            this.state++;
        }
        return v;
    }
};
exports.random = {
    /**
     * Generates a url-safe, ordered, random string.
     * Similar to MongoDB's ObjectId.
     * 32 timestamp bits.
     * 40 pseudorandom bits.
     * 24 sequence counter bits.
     */
    id() {
        const timestampBytes = createTimestampBytes(4);
        const randomBytes = createRandomBytes(5);
        const counterBytes = createCounterBytes(3);
        const idBytes = Buffer.concat([timestampBytes, randomBytes, counterBytes], 12);
        return base64url_1.default.encode(idBytes);
    },
    /**
     * Generates a url-safe, ordered, random string.
     * 48 timestamp bits.
     * 128 pseudorandom bits.
     */
    secureId() {
        const timestampBytes = createTimestampBytes(6);
        const randomBytes = createRandomBytes(16);
        const idBytes = Buffer.concat([timestampBytes, randomBytes], 22);
        return base64url_1.default.encode(idBytes);
    }
};
function createTimestampBytes(bytes) {
    const timestampBytes = Buffer.allocUnsafe(bytes);
    const timestamp = moment_1.default().unix();
    timestampBytes.writeUIntBE(
    // tslint:disable-next-line:no-bitwise
    timestamp % (1 << (bytes * 8)), 0, bytes);
    return timestampBytes;
}
function createRandomBytes(bytes) {
    return crypto_1.default.randomBytes(bytes);
}
function createCounterBytes(bytes) {
    const counterBytes = Buffer.allocUnsafe(bytes);
    counterBytes.writeUIntBE(
    // tslint:disable-next-line:no-bitwise
    counter.getAndIncrement() % (1 << (bytes * 8)), 0, bytes);
    return counterBytes;
}
