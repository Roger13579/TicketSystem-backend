import { Response, NextFunction } from 'express';
import { AppError, throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../repository/userRepository';
import { IUserReq } from '../types/common.type';
import { HttpStatus } from '../types/responseType';

/**
 * @description 只取得身分，不限制行為
 */
export const UserCheck = async (
  req: IUserReq,
  res: Response,
  next: NextFunction,
) => {
  const userRepository = new UserRepository();

  let token: string = '';
  const authorization = req.headers.authorization;
  try {
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRETS) as JwtPayload;
      const user = await userRepository.findById(payload.id);
      if (user) {
        req.user = user;
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

interface ICustomExpiredError extends Error {
  status?: string;
}

export const UserVerify = async (
  req: IUserReq,
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
    const payload = jwt.verify(token, process.env.JWT_SECRETS) as JwtPayload;
    const user = await userRepository.findById(payload.id);
    if (user) {
      req.user = user;
    } else {
      return next(
        new AppError(
          CustomResponseType.UNREGISTERED_USER,
          HttpStatus.UNAUTHORIZED,
          CustomResponseType.UNREGISTERED_USER_MESSAGE,
        ),
      );
    }
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      err.message = CustomResponseType.TOKEN_EXPIRED_MESSAGE;
      (err as ICustomExpiredError).status = CustomResponseType.TOKEN_EXPIRED;
    }
    return next(err);
  }
};
