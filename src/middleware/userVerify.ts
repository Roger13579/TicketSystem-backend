import { AppError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../repository/userRepository';
import { IUserReq, TMethod } from '../types/common.type';
import { HttpStatus } from '../types/responseType';

const verifyTokenAndFindUser = async (authorization?: string) => {
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRETS) as JwtPayload;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(payload.id);
    return user;
  }
  return null;
};

/**
 * @description 只取得身分，不限制行為
 */
export const UserCheck: TMethod<IUserReq, void> = async (req, res, next) => {
  try {
    const user = await verifyTokenAndFindUser(req.headers.authorization);
    if (user) {
      req.user = user;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

interface ICustomExpiredError extends Error {
  status?: string;
}

export const UserVerify: TMethod<IUserReq, void> = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new AppError(
        CustomResponseType.NOT_LOGIN,
        HttpStatus.UNAUTHORIZED,
        CustomResponseType.NOT_LOGIN_MESSAGE,
      ),
    );
  }
  try {
    const user = await verifyTokenAndFindUser(authorization);
    if (user) {
      req.user = user;
    } else {
      throw new AppError(
        CustomResponseType.UNREGISTERED_USER,
        HttpStatus.UNAUTHORIZED,
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
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
