import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const errorResponse: ApiError = {
      message: err.message,
      status: err.statusCode,
      code: err.code,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle unknown errors
  const errorResponse: ApiError = {
    message: 'Internal server error',
    status: 500,
  };
  res.status(500).json(errorResponse);
};
