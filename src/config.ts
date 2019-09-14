import { str, email, num, makeValidator, cleanEnv } from "envalid";

// const { str, email, num , makeValidator, cleanEnv} = envalid;

interface Config {
  JWT_SECRET: string;
  JWT_ALGORITHM: string;
  JWT_ISSUER: string;
  HASH_ALGORITHM: string;
  HASH_SALT_ROUNDS: number;
  FRONTEND_URL: string;
  ACCESS_TOKEN_COOKIE_NAME: string;
  SECRET_HEX: string;
  LOG_LVL: LogLvl;
  ADMIN_MAIL: string;
  ADMIN_PASSWORD: string;
}

const strHex64 = makeValidator<string>(x => {
  if (/^[0-9a-f]{64}$/.test(x)) {
    return x;
  }
  throw new Error("Expected a hex-character string of length 64");
});

const enum LogLvl {
  DEBUG = "debug",
  INFO = "info",
  ERROR = "error"
}

const logLvl = makeValidator<LogLvl>((x: string) => {
  if (["debug", "info", "error"].indexOf(x) !== -1) {
    return x;
  }
  throw new Error("Invalid log level.");
});

export const config = cleanEnv<Config>(process.env, {
  JWT_SECRET: str(),
  JWT_ALGORITHM: str(),
  JWT_ISSUER: email(),
  HASH_ALGORITHM: str(),
  HASH_SALT_ROUNDS: num(),
  FRONTEND_URL: str(),
  ACCESS_TOKEN_COOKIE_NAME: str(),
  SECRET_HEX: strHex64(),
  LOG_LVL: logLvl(),
  ADMIN_MAIL: email(),
  ADMIN_PASSWORD: str()
});
