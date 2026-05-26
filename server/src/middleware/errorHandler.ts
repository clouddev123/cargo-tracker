import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${status} ${message}`);
  res.status(status).json({ error: message, code: status });
}
