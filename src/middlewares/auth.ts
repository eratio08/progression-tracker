import { NextFunction, Request, Response } from "express";

import { TokenType, verifyJwt } from "../services";

import { asyncWrap } from "./async";
import { getRepository } from "typeorm";
import { User } from "../entities";

export const authenticate = () =>
  asyncWrap(async (req: Request, _: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }
    const splitAuthHeader = authHeader.split("Bearer ");
    if (splitAuthHeader.length < 2) {
      throw new Error("Malformed authorization header.");
    }
    const token = splitAuthHeader[1];
    let payload;
    try {
      payload = verifyJwt<{ id: string }>(token, TokenType.Access);
    } catch (error) {
      throw new Error();
    }
    const { id, aud } = payload;
    if (aud !== TokenType.Access) {
      throw new Error("Invalid token.");
    }
    const user = await getRepository(User).findOne(id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.authUser = user;
    next();
  });
