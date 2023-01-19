import { Request, Response, NextFunction } from 'express';
import ErrorCode from '../CodeError';

const middwareError = (err: ErrorCode, _req: Request, res: Response, _next: NextFunction) => {
  const { message, code } = err;
  res.status(code).json({ message });
};

export default middwareError;
