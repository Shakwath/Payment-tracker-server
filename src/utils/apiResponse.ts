import type { Response } from 'express';

export interface ApiResponseOptions<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export const sendResponse = <T>(
  res: Response,
  {
    statusCode = 200,
    success = true,
    message = 'Operation successful',
    data,
    meta,
  }: ApiResponseOptions<T>
): void => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    meta,
    data,
  });
};
