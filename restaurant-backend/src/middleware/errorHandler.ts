import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/appError";

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
