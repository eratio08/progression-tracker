import { Connection, createConnection } from "typeorm";
import { passwd, random } from "./services";
import { User, UserRole } from "./entities";
import { logger } from "./services/logger";
import { config } from "./config";

// uses the typeorm.json
export const db = async (): Promise<Connection | undefined> => {
  try {
    const connection = await createConnection();
    logger.info("DB connected");
    await seed(connection);
    return connection;
  } catch (error) {
    console.error("DB connection error:", error);
    return undefined;
  }
};

async function seed(con: Connection) {
  const userRepository = con.getRepository(User);
  const admin = await userRepository.findOne(undefined, {
    where: { email: config.ADMIN_MAIL }
  });
  if (!admin) {
    const hash = await passwd.hash("1234");
    await userRepository.save(
      new User(
        random.secureId(),
        config.ADMIN_MAIL,
        config.ADMIN_PASSWORD,
        hash,
        UserRole.ADMIN
      )
    );
    logger.debug("Admin created.");
  } else {
    logger.debug("Admin user exists.");
  }
}
