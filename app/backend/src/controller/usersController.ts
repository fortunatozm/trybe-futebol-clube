import { NextFunction, Request, Response } from 'express';
import { Jwt, sign, SignOptions, verify } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import UsersService from '../services/usersServices';
import { IUserInd } from '../interfaces/Interfaces';
import ErrorCode from '../CodeError';

const secret = process.env.JWT_SECRET || 'secret';

const tokenMessage = 'Token must be a valid token';

class UsersController {
  private static createToken(data: IUserInd) {
    const config: SignOptions = {
      expiresIn: '2d',
      algorithm: 'HS256',
    };
    const token = sign({ data }, secret, config);
    return token;
  }

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email: mail, password } = req.body;
    try {
      if (!password || !mail) {
        throw new ErrorCode('All fields must be filled', 400);
      }
      const user = await UsersService.getOne(mail);
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new ErrorCode('Incorrect email or password', 401);
      }
      const { email, username, role, id } = user;
      const token = UsersController.createToken({ email, username, role, id });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  static async validate(req: Request, res: Response) {
    const auth = req.headers.authorization;
    if (!auth) { throw new ErrorCode(tokenMessage, 401); }
    const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;
    let data: Jwt;
    try { data = verify(token, secret, { complete: true }) as Jwt; } catch (e) {
      throw new ErrorCode(tokenMessage, 401);
    }
    const emaill = data.payload.data.email;
    const exists = await UsersService.getOne(emaill);
    if (!exists) { throw new ErrorCode(tokenMessage, 401); }
    const { password, ...user } = exists;
    res.status(200).json({ role: user.role });
  }
}

export default UsersController;
