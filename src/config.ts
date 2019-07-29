import envalid from "envalid";

const { str, email } = envalid;

interface Config {
  JWT_SECRET: string;
  JWT_ALGORITHM: string;
  JWT_ISSUER: string;
  HASH_ALGORITHM: string;
}

export const config = envalid.cleanEnv<Config>(process.env, {
  JWT_SECRET: str(),
  JWT_ALGORITHM: str(),
  JWT_ISSUER: email(),
  HASH_ALGORITHM: str()
});
