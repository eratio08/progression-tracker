import { Connection, createConnection } from "typeorm";
import { config } from "./config";
import { User, UserRole } from "./entities";
import { password, random } from "./services";
import { logger } from "./services/logger";

export const db = () => {
  let connection: Connection;
  return {
    async connect(): Promise<Connection> {
      if (config.NODE_ENV === "test") {
        // TODO
        // const client = new Client(config.DB_CONNECTION_STRING);
        // await client.connect();
        // const testId = `test_${Date.now()}_${Math.floor(
        //   Math.random() * Number.MAX_SAFE_INTEGER
        // )}`;
        // await client.query(`CREATE USER ${testId} WITH PASSWORD 'pass';`);
        // await client.query(`CREATE DATABASE ${testId} WITH OWNER = ${testId};`);
        // await client.end();
      }
      const connection = await createConnection();
      logger.info("DB connected");
      await seed(connection);
      return connection;
    },
    async disconnect(): Promise<void> {
      if (connection) {
        await connection.close();
      }
    }
  };
};

async function seed(con: Connection) {
  const userRepository = con.getRepository(User);
  const admin = await userRepository.findOne(undefined, {
    where: { email: config.ADMIN_MAIL }
  });
  if (!admin) {
    const hash = await password.hash(config.ADMIN_PASSWORD);
    await userRepository.save(
      new User(
        random.secureId(),
        config.ADMIN_MAIL,
        hash,
        "Admin",
        UserRole.ADMIN
      )
    );
    logger.debug("Admin created.");
  } else {
    logger.debug("Admin user exists.");
  }
}
