const envalid = require('envalid');

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_SCHEMA
} = envalid.cleanEnv(process.env, {
  DB_USERNAME: envalid.str(),
  DB_PASSWORD: envalid.str(),
  DB_TYPE: envalid.str(),
  DB_HOST: envalid.str(),
  DB_PORT: envalid.num(),
  DB_SCHEMA: envalid.str()
});

module.exports = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_SCHEMA,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  synchronize: true,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  }
};
