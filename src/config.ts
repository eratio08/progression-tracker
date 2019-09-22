import {
  cleanEnv,
  email,
  makeValidator,
  num,
  str,
  ValidatorSpec
} from "envalid";

// const { str, email, num , makeValidator, cleanEnv} = envalid;

interface Config {
  NODE_ENV: NodeEnv;
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
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_SCHEMA: string;
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

type NodeEnv = "production" | "test" | "development";

export const config = cleanEnv<Config>(process.env, {
  NODE_ENV: str({
    choices: ["production", "test", "development"]
  }) as ValidatorSpec<NodeEnv>,
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
  ADMIN_PASSWORD: str(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_TYPE: str(),
  DB_HOST: str(),
  DB_PORT: num(),
  DB_SCHEMA: str()
});
