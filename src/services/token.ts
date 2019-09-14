import {
  JWE, // JSON Web Encryption (JWE)
  JWK, // JSON Web Key Set (JWKS)
  JWS
} from "@panva/jose";
import moment from "moment";
import { config } from "../config";
import { random } from "./random";

const secretBuffer = Buffer.from(config.SECRET_HEX, "hex");

const jwk = JWK.asKey(secretBuffer);

/**
 * Token types.
 */
export enum TokenType {
  Access = "Access",
  SignUp = "SignUp"
}

/**
 * A Token has the following claims:
 *  * iss - Issuer
 *  * sub - Subject
 *  * aud - Audience
 *  * nbf - Not Before
 *  * jti - JWT Id
 *  * iat - Issued At
 *  * exp - Expiration Time
 *
 * Source: https://tools.ietf.org/html/rfc7519#section-4.1
 */
export interface BaseToken<T extends object & {}> {
  iss?: string;
  sub: T;
  aud: string;
  nbf?: string;
  jti: string;
  iat: number;
  exp: number;
}

export const token = {
  /**
   * Generates a new token.
   * @param claims
   */
  newToken<T extends object>(
    subject: T,
    audience: TokenType,
    expireMinutes: number
  ): BaseToken<T> {
    return {
      sub: subject,
      aud: audience,
      iat: moment().unix(),
      exp: moment()
        .add(expireMinutes, "minutes")
        .unix(),
      iss: config.JWT_ISSUER,
      jti: random.secureId()
    };
  },

  /**
   * Signs a given token. (JWS)
   * @param token the token
   */
  sign<T extends object>(token: BaseToken<T>): string {
    return JWS.sign(token, jwk, { alg: "HS512" });
  },

  /**
   * Verifies a given signature. (JWS)
   * @param payload the signed payload
   */
  verify<T extends object>(jws: string): BaseToken<T> {
    return JWS.verify(jws, jwk) as BaseToken<T>;
  },

  /**
   * Encrypt a given token. (JWE)
   * @param token the token
   */
  encrypt<T extends object>(token: BaseToken<T>): string {
    return JWE.encrypt(Buffer.from(JSON.stringify(token)), jwk);
  },

  /**
   * Decrypt an encrypted token. (JWE)
   * @param jwe the encrypted payload
   */
  decrypt<T extends object>(jwe: string): BaseToken<T> {
    const payload = JWE.decrypt(jwe, jwk);
    return JSON.parse(payload.toString("utf8")) as BaseToken<T>;
  }
};
