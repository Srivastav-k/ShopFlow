import type { Request, Response, NextFunction } from 'express';
import { formatError } from '../utils/responseFormatter.js';

export function errorHandler(err: Error & { statusCode?: number; code?: string }, _req: Request, res: Response, _next: NextFunction): void {
  console.error(`Error: ${err.message}`);
  const { statusCode, body } = formatError(err);
  res.status(statusCode).json(body);
}
