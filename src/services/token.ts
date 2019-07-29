import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import moment from "moment";
import { config } from "../config";

/**
 * Token types.
 */
export enum TokenType {
  Access = "Access",
  SignUp = "SignUp"
}

/**
 * Generates a JWT acording to {@link https://tools.ietf.org/html/rfc7519#section-4.1}.
 *
 * A Token has the following claims:
 *  * iss - Issuer
 *  * sub - Subject
 *  * aud - Audience
 *  * nbf - Not Before
 *  * jti - JWT Id
 *  * iat - Issued At
 *  * exp - Expiration Time
 *
 * @param subject the subject
 * @param type the type of token
 */
export const generateJwt = (subject: string, type: TokenType): string => {
  const signOptions: SignOptions = {
    algorithm: config.JWT_ALGORITHM,
    issuer: config.JWT_ISSUER,
    audience: type,
    expiresIn: moment()
      .add(10, "minutes")
      .unix()
  };
  return sign(subject, config.JWT_SECRET, signOptions);
};

/**
 * Verifies a given token.
 * @param token  the token
 * @param type the type of token
 */
export const verifyJwt = <T>(
  token: string,
  type: TokenType
): T & {
  iat: number;
  exp: number;
  aud: TokenType;
  iss: string;
} => {
  const verificationOptions: VerifyOptions = {
    algorithms: [config.JWT_ALGORITHM],
    issuer: config.JWT_ISSUER,
    audience: type
  };
  return verify(token, config.JWT_SECRET, verificationOptions) as T & {
    iat: number;
    exp: number;
    aud: TokenType;
    iss: string;
  };
};
