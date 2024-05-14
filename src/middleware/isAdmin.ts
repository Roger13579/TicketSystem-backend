import { Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { IUserReq } from '../types/common.type';
import { IUser } from '../models/user';
import { AccountType } from '../types/user.type';
import { HttpStatus } from '../types/responseType';

export const IsAdmin = async (
  req: IUserReq,
  res: Response,
  next: NextFunction,
) => {
  const accountType = (req.user as IUser).accountType;

  if (accountType !== AccountType.admin) {
    return next(
      new AppError(
        CustomResponseType.PERMISSION_DENIED_MESSAGE,
        HttpStatus.UNAUTHORIZED,
        CustomResponseType.PERMISSION_DENIED,
      ),
    );
  }
  return next();
};
