import { Response, NextFunction } from 'express';
import { Jwt, verify } from 'jsonwebtoken';
import ErrorCode from '../CodeError';
import { ReqUser } from '../interfaces/Interfaces';
import usersServices from '../services/usersServices';

const secret = process.env.JWT_SECRET || 'secret';

const tokenMsg = 'Token must be a valid token';

let data: Jwt;

const tokenMiddleware = async (req: ReqUser, _res: Response, next: NextFunction): Promise<void> => {
  const auth = req.headers.authorization;
  try {
    if (!auth) {
      throw new ErrorCode(tokenMsg, 401);
    }
    const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;
    try { data = verify(token, secret, { complete: true }) as Jwt; } catch (e) {
      throw new ErrorCode(tokenMsg, 401);
    }
    const mail = data.payload.email;
    const passwordd = data.payload.data.password;
    const exists = await usersServices.getOne(mail, passwordd);
    if (!exists) { throw new ErrorCode(tokenMsg, 401); }
    const { password, ...user } = exists;
    req.user = user;
  } catch (error) {
    next(error);
  }
};

export default tokenMiddleware;
