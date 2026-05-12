import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiErrorBody } from '../types/errors';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const fields: Record<string, string> = {};
  for (const err of result.array() as Array<{ path?: string; msg: string }>) {
    if (err.path && !fields[err.path]) {
      fields[err.path] = err.msg;
    }
  }

  const body: ApiErrorBody = {
    status: 'error',
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
    fields,
  };

  res.status(400).json(body);
};
