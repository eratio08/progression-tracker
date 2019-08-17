import { Connection, createConnection } from "typeorm";
import { hashPassword, random } from "./services";
import { User } from "./entities";
import { logger } from "./services/logger";

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
  const adminMail = "admin@elurz.de";
  const admin = await userRepository.findOne(undefined, {
    where: { email: adminMail }
  });
  if (!admin) {
    const hash = await hashPassword("1234");
    await userRepository.save(
      new User(random.secureId(), adminMail, "Admin", hash)
    );
    logger.debug("Admin created.");
  } else {
    logger.debug("Admin user exists.");
  }
}
