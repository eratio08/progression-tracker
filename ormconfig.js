const envalid = require("envalid");

const { TYPEORM_USERNAME, TYPEORM_PASSWORD } = envalid.cleanEnv(process.env, {
  TYPEORM_USERNAME: envalid.str(),
  TYPEORM_PASSWORD: envalid.str()
});

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "dev",
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscribers"
  }
};
