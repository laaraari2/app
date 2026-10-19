import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { env } from '../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const errorCode = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal server error occurred';

  // Standard RFC 7807 Problem Details response structure
  const problemDetails = {
    type: `https://eduvora.com/errors/${errorCode.toLowerCase()}`,
    title: errorCode.replace(/_/g, ' '),
    status: statusCode,
    detail: message,
    instance: req.originalUrl,
    code: errorCode,
    timestamp: new Date().toISOString(),
    ...(isAppError && err.details ? { details: err.details } : {}),
    ...(env.NODE_ENV === 'development' && !isAppError ? { stack: err.stack } : {}),
  };

  if (statusCode >= 500) {
    console.error(`💥 [ERROR 500] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json(problemDetails);
}
