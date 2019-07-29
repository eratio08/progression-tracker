import { User } from "../entities";

/**
 * Hier können express interfaces erweitert werden.
 */
declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }

  interface Response {}
  interface Application {}
}
