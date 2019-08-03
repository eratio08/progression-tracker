import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { config } from "../config";
import { User } from "../entities";
import { BaseToken, token, TokenType } from "../services";
import { asyncWrap } from "./async";

export const authenticate = () =>
  asyncWrap(async (req: Request, _: Response, next: NextFunction) => {
    const cookies = parseCookies(req);
    const accessCookie = cookies[config.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessCookie) {
      next();
      return;
    }
    let jwsToken: BaseToken<{ id: string }>;
    try {
      jwsToken = token.verify<{ id: string }>(accessCookie);
    } catch (error) {
      throw new Error("Invalid token.");
    }
    const { sub, aud } = jwsToken;
    if (aud !== TokenType.Access) {
      throw new Error("Invalid token.");
    }
    const user = await getRepository(User).findOne(sub.id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.authUser = user;
    next();
  });

function parseCookies(req: Request): Record<string, string> {
  const { cookie: cookieStr } = req.headers;
  if (!cookieStr) {
    return {};
  }
  const cookies = cookieStr.split("; ");
  return cookies
    .map(cookie => cookie.split("="))
    .map(([key, value]) => ({ [key]: value }))
    .reduce((acc, cookie) => ({ ...acc, ...cookie }), {});
}
