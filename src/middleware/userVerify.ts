import { Request, Response, NextFunction } from 'express';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { UserRepository } from '../repository/userRepository';

export const UserVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userRepository = new UserRepository();

  let token: string = '';
  const authorization = req.headers.authorization;
  try {
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      throwError(
        CustomResponseType.NOT_LOGIN_MESSAGE,
        CustomResponseType.NOT_LOGIN,
      );
    }
    const payload = jwt.verify(token, process.env.JWT_SECRETS as any);
    const user = await userRepository.findById((payload as any).id);
    if (user) {
      req.user = user;
    }
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      err.message = CustomResponseType.TOKEN_EXPIRED_MESSAGE;
      (err as any).status = CustomResponseType.TOKEN_EXPIRED;
    }
    return next(err);
  }
};