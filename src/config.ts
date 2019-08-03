import envalid from "envalid";

const { str, email, num } = envalid;

interface Config {
  JWT_SECRET: string;
  JWT_ALGORITHM: string;
  JWT_ISSUER: string;
  HASH_ALGORITHM: string;
  HASH_SALT_ROUNDS: number;
  FRONTEND_URL: string;
  ACCESS_TOKEN_COOKIE_NAME: string;
  SECRET_HEX: string;
}

const strHex64 = envalid.makeValidator<string>(x => {
  if (/^[0-9a-f]{64}$/.test(x)) {
    return x;
  }
  throw new Error("Expected a hex-character string of length 64");
});

export const config = envalid.cleanEnv<Config>(process.env, {
  JWT_SECRET: str(),
  JWT_ALGORITHM: str(),
  JWT_ISSUER: email(),
  HASH_ALGORITHM: str(),
  HASH_SALT_ROUNDS: num(),
  FRONTEND_URL: str(),
  ACCESS_TOKEN_COOKIE_NAME: str(),
  SECRET_HEX: strHex64()
});
