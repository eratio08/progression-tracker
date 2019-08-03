"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps a middleware in a promise to allow async/await.
 * @param middleware the middleware.
 */
exports.asyncWrap = (middleware) => (req, res, next) => {
    Promise.resolve(middleware(req, res, next)).catch(error => next(error));
};
