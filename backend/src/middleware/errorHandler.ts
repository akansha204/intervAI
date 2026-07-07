import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorBody } from '../types/errors';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

const codeFromStatus = (status: number): string => {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 429) return 'RATE_LIMITED';
  return 'INTERNAL_ERROR';
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path }, 'API error (5xx)');
    } else {
      logger.warn({ err, path: req.path }, 'API error');
    }

    const body: ApiErrorBody = {
      status: 'error',
      code: err.code,
      message: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    };
    return res.status(err.statusCode).json(body);
  }

  const anyErr = err as { statusCode?: number; message?: string; stack?: string };
  const statusCode = anyErr?.statusCode ?? 500;
  const message = anyErr?.message ?? 'Internal Server Error';

  logger.error({ err, path: req.path }, 'Unhandled error');

  const body: ApiErrorBody & { stack?: string } = {
    status: 'error',
    code: codeFromStatus(statusCode),
    message,
  };

  if (env.NODE_ENV === 'development' && anyErr?.stack) {
    body.stack = anyErr.stack;
  }

  return res.status(statusCode).json(body);
};
