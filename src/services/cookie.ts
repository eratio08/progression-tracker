import { CookieOptions, Request, Response } from "express";
import { config } from "../config";
import { User } from "../entities";
import { BaseToken, token, TokenType } from "./token";
import moment = require("moment");

export const cookie = {
  setAccessToken(user: User, ctx: { request: Request; response: Response }) {
    const jwsToken = token.newToken(
      { email: user.email, id: user.id },
      TokenType.Access,
      10
    );
    setTokenCookie(ctx, jwsToken);
  }
};

function setTokenCookie(
  ctx: { request: Request; response: Response },
  jwsToken: BaseToken<object>
) {
  const jws = token.sign(jwsToken);
  const options: CookieOptions = {
    expires: moment.unix(jwsToken.exp).toDate(),
    secure: ctx.request.secure,
    httpOnly: true,
    sameSite: "strict" as "strict"
  };
  ctx.response.cookie(config.ACCESS_TOKEN_COOKIE_NAME, jws, options);
}
