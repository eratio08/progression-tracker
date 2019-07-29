import { Connection, createConnection } from "typeorm";

// uses the typeorm.json
export const db = async (): Promise<Connection | undefined> => {
  try {
    const connection = await createConnection();
    console.log("DB connected");
    return connection;
  } catch (error) {
    console.error("DB connection error:", error);
    return undefined;
  }
};
