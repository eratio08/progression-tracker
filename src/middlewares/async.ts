import { NextFunction, Request, Response } from "express";

/**
 * Wraps a middleware in a promise to allow async/await.
 * @param middleware the middleware.
 */
export const asyncWrap = (
  middleware: (req: Request, res: Response, next: NextFunction) => void
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(middleware(req, res, next)).catch(error => next(error));
};
