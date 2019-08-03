import bcrypt from "bcrypt";
import { config } from "../config";

export const hashPassword = async (password: string): Promise<string> => {
  const iterations = config.HASH_SALT_ROUNDS;
  const salt = await bcrypt.genSalt(iterations);
  const hashedPassword = await bcrypt.hash(password, salt);
  return [hashedPassword, salt].join(":");
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const [hashedPassword, salt] = hash.split(":");
  const inputHashed = await bcrypt.hash(password, salt);
  return inputHashed === hashedPassword;
};
