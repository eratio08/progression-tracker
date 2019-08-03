import base64url from "base64url";
import crypto from "crypto";
import moment from "moment";

const counter = {
  state: createRandomBytes(32).readUInt32BE(0) % Number.MAX_SAFE_INTEGER,
  getAndIncrement() {
    const v = this.state;
    if (this.state === Number.MAX_SAFE_INTEGER) {
      this.state = Number.MIN_SAFE_INTEGER;
    } else {
      this.state++;
    }
    return v;
  }
};

export const random = {
  /**
   * Generates a url-safe, ordered, random string.
   * Similar to MongoDB's ObjectId.
   * 32 timestamp bits.
   * 40 pseudorandom bits.
   * 24 sequence counter bits.
   */
  id(): string {
    const timestampBytes = createTimestampBytes(4);
    const randomBytes = createRandomBytes(5);
    const counterBytes = createCounterBytes(3);
    const idBytes = Buffer.concat(
      [timestampBytes, randomBytes, counterBytes],
      12
    );
    return base64url.encode(idBytes);
  },

  /**
   * Generates a url-safe, ordered, random string.
   * 48 timestamp bits.
   * 128 pseudorandom bits.
   */
  secureId(): string {
    const timestampBytes = createTimestampBytes(6);
    const randomBytes = createRandomBytes(16);
    const idBytes = Buffer.concat([timestampBytes, randomBytes], 22);
    return base64url.encode(idBytes);
  }
};

function createTimestampBytes(bytes: number) {
  const timestampBytes = Buffer.allocUnsafe(bytes);
  const timestamp = moment().unix();
  timestampBytes.writeUIntBE(
    // tslint:disable-next-line:no-bitwise
    timestamp % (1 << (bytes * 8)),
    0,
    bytes
  );
  return timestampBytes;
}

function createRandomBytes(bytes: number) {
  return crypto.randomBytes(bytes);
}

function createCounterBytes(bytes: number) {
  const counterBytes = Buffer.allocUnsafe(bytes);
  counterBytes.writeUIntBE(
    // tslint:disable-next-line:no-bitwise
    counter.getAndIncrement() % (1 << (bytes * 8)),
    0,
    bytes
  );
  return counterBytes;
}
