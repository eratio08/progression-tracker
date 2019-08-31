import { User } from "../../entities";

/**
 * Express types can be augmented here.
 */
declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }

    interface Response {}

    interface Application {}
  }
}

// declare namespace Express {
//   export interface Request {
//     authUser?: User;
//   }

//   export interface Response {}

//   export interface Application {}
// }
